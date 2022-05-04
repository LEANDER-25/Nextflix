import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drive_v3, google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import * as bluebird from 'bluebird';
import { FileType } from 'src/models/movie/file-type.enum';
const fsAsync = bluebird.promisifyAll(fs);
const rootPath = path.dirname(path.dirname(__dirname));
import { AxiosRequestConfig, AxiosResponseHeaders } from 'axios';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestError } from 'src/helpers/errors/axios-request-error';
import { lastValueFrom, map, tap } from 'rxjs';
import { OutOfRangeError } from 'src/helpers/errors/out-of-range-error';
import { UploadFileFailError } from 'src/helpers/errors/upload-file-fail-error';

/**
 * @field name: name of file
 * @field mediaType: format file type
 * @field size: size of file
 */
export interface UploadFileInfo {
  name: string;
  mediaType: string;
  size?: number;
  type: FileType;
}

export interface ChunkElementRequest<T> {
  mimeType: string;
  start: number;
  end: number;
  fileSize: number;
  uploadUrl: string;
  partOfFile: T;
}

export interface ChunkBlobElement {
  start: number;
  end: number;
  part: Blob;
}

export interface ChunkFSElement {
  start: number;
  end: number;
  part: any;
  isCompleted?: boolean;
}

export interface CustomResponse {
  headers?: AxiosResponseHeaders | null;
  status?: number;
  data?: any | null;
}

@Injectable()
export class MyDriveService {
  private drive: drive_v3.Drive;

  private folders: object;

  constructor(
    private configService: ConfigService,
    private axios: HttpService,
  ) {
    try {
      this.folders = {
        trailer: configService.get('TRAILERS_FOLDER_ID'),
        movie: configService.get('MOVIES_FOLDER_ID'),
        series: configService.get('SERIES_FOLDER_ID'),
        image: configService.get('IMG_FOLDER_ID'),
        imgTitle: configService.get('IMG_TITLES_FOLDER_ID'),
        background: configService.get('BGMS_FOLDER_id'),
        avatar: configService.get('AVT_FOLDER_ID'),
      };
      const oauth2client = new google.auth.OAuth2(
        configService.get('CLIENT_ID'),
        configService.get('CLIENT_SECRET'),
        configService.get('REDIRECT_URI'),
      );
      oauth2client.setCredentials({
        refresh_token: configService.get('REFRESH_TOKEN'),
      });
      this.drive = google.drive({
        version: 'v3',
        auth: oauth2client,
      });
    } catch (error) {
      console.error(error);
    }
  }

  #getDestUploadFolder(type: FileType) {
    return this.folders[type];
  }

  /**
   * Return the url of file can be used to display on browser
   * @param fileId
   * @returns
   */
  async getFileViewUrl(fileId: string) {
    const fileViewUrl = await this.drive.files.get({
      fileId,
      fields: 'webViewLink',
    });
    return fileViewUrl.data;
  }

  #parseFileIdFromViewLink(webViewLink: string) {
    const entryLink = 'https://drive.google.com/file/d/';
    return webViewLink.substring(entryLink.length).split('/')[0];
  }

  /**
   * Method used to upload small file to cloud
   * @param file
   * @param uploadFileInfo
   * @returns
   */
  async #uploadMultipart(
    file: Express.Multer.File,
    uploadFileInfo: UploadFileInfo,
  ) {
    //Get Id of destiny cloud folder
    const folderId = this.#getDestUploadFolder(uploadFileInfo.type);

    const metadata = {
      name: `${uploadFileInfo.name}.${uploadFileInfo.mediaType.split('/')[1]}`,
      parents: [folderId],
    };

    const media = {
      mimeType: uploadFileInfo.mediaType,
      body: fs.createReadStream(path.join(rootPath, file.path)),
    };
    const uploaded = await this.drive.files.create({
      requestBody: metadata,
      media: media,
      fields: 'id',
    });
    console.log('upload success');
    await this.removeTempFile(file.filename);
    console.log(uploaded.data);
    return await this.getFileViewUrl(uploaded.data.id);
  }

  async #refreshAccessToken() {
    const clientId = this.configService.get('CLIENT_ID');
    const clientSecret = this.configService.get('CLIENT_SECRET');
    const refreshToken = this.configService.get('REFRESH_TOKEN');

    const param = `client_secret=${clientSecret}&grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}`;

    return await lastValueFrom(
      this.axios
        .post(`https://accounts.google.com/o/oauth2/token?${param}`)
        .pipe(map((res) => res.data)),
    );
  }

  /**
   * Method used to get google resumable url, which used to upload file in resum mode
   * @param uploadFileInfo
   * @returns
   */
  async #getGoogleResumableUrl(
    uploadFileInfo: UploadFileInfo,
    folderId: string,
  ) {
    const metadata = {
      name: uploadFileInfo.name,
      parents: [folderId],
    };

    const access = await this.#refreshAccessToken();
    console.log('the access token is: ');
    console.log(access);

    const token = access.access_token;
    const url =
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';
    const headers: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Length': uploadFileInfo.size,
        'X-Upload-Content-Type': uploadFileInfo.mediaType,
      },
    };

    if (metadata && token) {
      try {
        console.log('respone from nestjs/axios');
        const res = await lastValueFrom(
          this.axios
            .post(url, JSON.stringify(metadata), headers)
            .pipe(map((res) => res.headers)),
        );
        const resumUrl = res['location'];
        return {
          url: resumUrl,
        };
      } catch (error) {
        console.log('catched error');
        console.error(error);
        throw new AxiosRequestError();
      }
    } else {
      return {
        url: 'empty',
      };
    }
  }

  /**
   * Separate the file into smaller parts. Each part has max size is 2.5 MB, can be set to smaller size
   * @param file
   * @returns a array contains file parts
   */
  #separateFileToChunks(
    file: Express.Multer.File,
    maxElementSize = 2560 * 1024,
  ) {
    if (maxElementSize > 2560 * 1024) {
      throw new OutOfRangeError();
    }
    let chunks: Array<ChunkFSElement> = [];
    const reader = fs.createReadStream(path.join(rootPath, file.path), {
      start: 0,
      end: file.size,
      highWaterMark: maxElementSize,
    });
    console.log(`File Size: ${file.size}`);
    let offset = 0;
    return new Promise<Array<ChunkFSElement>>((resole, reject) => {
      reader.on('data', (chunk: Buffer) => {
        console.log(`start: ${offset}, end: ${offset + chunk.length}`);
        chunks.push({
          part: Buffer.from(chunk),
          start: offset,
          end: offset + chunk.length,
          isCompleted: false,
        });
        offset += chunk.length;
      });
      reader.on('error', (error) => reject(error));
      reader.on('end', () => resole(chunks));
    });
  }

  /**
   * Method used to upload one by one part of file to cloud
   * @param element ChunkElementRequest
   * @returns status of uploaded part response
   */
  async #saveChunksToDrive(
    element: ChunkElementRequest<Buffer>,
  ): Promise<CustomResponse> {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': element.mimeType,
        'Content-Length': element.partOfFile.length,
        'Content-Range': `bytes ${element.start}-${element.end - 1}/${
          element.fileSize
        }`,
      },
    };

    try {
      const res = await lastValueFrom(
        this.axios
          .put(element.uploadUrl, element.partOfFile, config)
          .pipe(map((resp) => resp)),
      );
      return {
        headers: res.headers,
        data: res.data,
        status: res.status,
      };
    } catch (error) {
      console.log(`>>>>>${error.response.status}`);
      switch (error.response.status) {
        case 308:
          return {
            status: 308,
          };
        case 503:
          return {
            status: 503,
          };
        default:
          throw new AxiosRequestError();
      }
    }
  }

  /**
   * Method used to upload chunks array. With a mission: Upload forever until all successfully, it will join into recursion.
   * @param chunks
   * @param uploadInfo
   * @param resumableUrl
   * @returns
   */
  async #resumableChunksUpload(
    chunks: Array<ChunkFSElement>,
    uploadInfo: UploadFileInfo,
    resumableUrl: string,
  ) {
    let uploaded: CustomResponse;
    try {
      let percent = 0;
      for (let index = 0; index < chunks.length; index++) {
        const part = chunks[index];
        if (part.isCompleted === false) {
          const res = await this.#saveChunksToDrive({
            start: part.start,
            end: part.end,
            fileSize: uploadInfo.size,
            uploadUrl: resumableUrl,
            partOfFile: part.part,
            mimeType: uploadInfo.mediaType,
          });

          if (res.status === 308) {
            const current = (part.part.length * 100) / uploadInfo.size;
            percent += current;
            console.log(`uploaded of 100% --- ${percent.toFixed(2)}%`);
            part.isCompleted = true;
          } else if (res.status === 503) {
            this.#resumableChunksUpload(chunks, uploadInfo, resumableUrl);
          } else {
            uploaded = res;
          }
        } else {
          continue;
        }
      }
      return uploaded;
    } catch (error) {
      console.log('catched error in resum method');
      console.error(error);
      // await this.removeTempFile(file.filename);
      throw new UploadFileFailError();
    }
  }

  async #uploadResumable(
    file: Express.Multer.File,
    uploadFileInfo: UploadFileInfo,
  ) {
    const folderId = this.#getDestUploadFolder(uploadFileInfo.type);
    const resumbleUrl = await this.#getGoogleResumableUrl(
      uploadFileInfo,
      folderId,
    );
    console.log(resumbleUrl.url);

    let chunks = await this.#separateFileToChunks(file);
    console.log(chunks.length);
    const res = await this.#resumableChunksUpload(
      chunks,
      uploadFileInfo,
      resumbleUrl.url,
    );
    if (res.status === 200) {
      await this.removeTempFile(file.filename);
      return await this.getFileViewUrl(res.data.id);
    } else {
      throw new UploadFileFailError();
    }
  }

  #convertDefaultLinkToDisplayAbleLink(webViewLink: string, type: FileType) {
    switch (type) {
      case FileType.Avatar:
      case FileType.Background:
      case FileType.Image:
      case FileType.ImageTitle: {
        const passCorbPart = 'uc?export=view&id=';
        webViewLink = webViewLink.replace('file/d/', passCorbPart);
        webViewLink = webViewLink.replace('/view?usp=drivesdk', '');
        console.log(`Modify link: ${webViewLink}`);
        break;
      }
      default:{
        webViewLink = webViewLink.replace('/view?usp=drivesdk', '/preview');
        break;
      }
    }
    return webViewLink;
  }

  async uploadFile(file: Express.Multer.File, name: string, type: FileType) {
    const smallSize = 25 * 1024 * 1024;
    try {
      let res: drive_v3.Schema$File;
      if (file.size > smallSize) {
        res = await this.#uploadResumable(file, {
          name,
          mediaType: file.mimetype,
          size: file.size,
          type,
        });
      } else {
        res = await this.#uploadMultipart(file, {
          name,
          mediaType: file.mimetype,
          size: file.size,
          type,
        });
      }
      res.webViewLink = this.#convertDefaultLinkToDisplayAbleLink(
        res.webViewLink,
        type,
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Method used to remove (unlink) cloud file, using file id, return 1 for success and 0 for fail
   * @param fileIdOrViewLink
   * @returns
   */
  async removeCloudFile(fileIdOrViewLink: string) {
    if (
      fileIdOrViewLink.includes('https') ||
      fileIdOrViewLink.includes('view?usp')
    ) {
      fileIdOrViewLink = this.#parseFileIdFromViewLink(fileIdOrViewLink);
    }

    try {
      const result = await this.drive.files.delete({
        fileId: fileIdOrViewLink,
      });
      if (result.status === 204) return 1;
      return 0;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  /**
   * Remove temp file was stored in uploads folder after uploading successfully
   * @param name
   */
  async removeTempFile(name: string) {
    const uploadsDirpath = rootPath + `/uploads`;
    const allFiles = await fsAsync.readdirAsync(uploadsDirpath);
    // allFiles.forEach((item) => console.log(item));
    const fileBaseName = allFiles.find((item) => item.includes(name));
    // console.log(fileBaseName);
    const removeFile = rootPath + `/uploads/${fileBaseName}`;
    try {
      await fsAsync.unlinkAsync(removeFile);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  getFileType(rawType: string) {
    switch (rawType) {
      case FileType.Avatar:
        return FileType.Avatar;
      case FileType.Background:
        return FileType.Background;
      case FileType.Image:
        return FileType.Image;
      case FileType.ImageTitle:
        return FileType.ImageTitle;
      case FileType.Movie:
        return FileType.Movie;
      case FileType.Trailer:
        return FileType.Trailer;
      case FileType.Series:
        return FileType.Series;
      default:
        throw new OutOfRangeError();
    }
  }
}
