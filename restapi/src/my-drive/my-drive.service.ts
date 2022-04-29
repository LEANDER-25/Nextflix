import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drive_v3, google } from 'googleapis';
import * as fs from 'fs'
import * as path from 'path'
import * as bluebird from 'bluebird';
import { FileType } from 'src/models/movie/file-type.enum';
const fsAsync = bluebird.promisifyAll(fs);
const rootPath = path.dirname(path.dirname(__dirname));
import { Express } from 'express';

export interface UploadFileInfo {
  name: string;
  mediaType: string;
  size?: number;
  type: FileType
}

@Injectable()
export class MyDriveService {

  drive: drive_v3.Drive;

  folders: object;

  constructor(configService: ConfigService) {
    try {
      this.folders = {
        trailer: configService.get('TRAILERS_FOLDER_ID'),
        movie: configService.get('MOVIES_FOLDER_ID'),
        series: configService.get('SERIES_FOLDER_ID'),
        image: configService.get('IMG_FOLDER_ID'),
        imgTitle: configService.get('IMG_TITLES_FOLDER_ID'),
        background: configService.get('BGMS_FOLDER_id'),
        avatar: configService.get('AVT_FOLDER_ID')
      }
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

  getDestUploadFolder(type: FileType) {
    return this.folders[type];
  }

  async setPublicFile() {}

  async uploadMultipart(file: Express.Multer.File, uploadFileInfo: UploadFileInfo) {
    console.log(uploadFileInfo.mediaType);
    console.log(uploadFileInfo.mediaType.split('/')[1]);
    console.log(rootPath);

    const folderId = this.getDestUploadFolder(uploadFileInfo.type);
    
    const metadata = {
      name: `${uploadFileInfo.name}.${uploadFileInfo.mediaType.split('/')[1]}`,
      parents: [folderId]
    };
    
    const media = {
      mimeType: uploadFileInfo.mediaType,
      body: fs.createReadStream(
        path.join(rootPath, file.path)
      ),
    };
    const uploaded = await this.drive.files.create({
      requestBody: metadata,
      media: media,
      fields: 'id'
    });
    console.log('upload success');
    await this.removeTempFile(file.filename);
    console.log(uploaded.data);
  }

  async uploadResumable(name: string, file, mediaType: string) {}

  async uploadFile(file: Express.Multer.File, uploadFileInfo: UploadFileInfo) {
    // const smallSize = 5 * 1024 * 1024;
    // if (size > smallSize) {
    //   this.uploadResumable(name, file, mediaType);
    // } else {
    //   this.uploadMultipart(name, file, mediaType);
    // }
    this.uploadMultipart(file, uploadFileInfo);
  }

  async removeCloudFile() {}

  /**
   * Remove temp file was stored in uploads folder after uploading successfully
   * @param name 
   */
  async removeTempFile(name: string) {
    // console.log(name);
    // console.log(__dirname);
    const uploadsDirpath = rootPath + `/uploads`;
    const allFiles = await fsAsync.readdirAsync(uploadsDirpath);
    allFiles.forEach((item) => console.log(item));
    const fileBaseName = allFiles.find((item) => item.includes(name));
    console.log(fileBaseName);
    const removeFile = rootPath + `/uploads/${fileBaseName}`;
    try {
      await fsAsync.unlinkAsync(removeFile);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
