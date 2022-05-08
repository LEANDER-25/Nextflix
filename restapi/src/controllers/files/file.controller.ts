import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMovieFileDto } from 'src/dtos/movie/create-movie-file.dto';
import { OutOfRangeError } from 'src/helpers/errors/out-of-range-error';
import { JwtAuthGuard } from 'src/middlewares/guards/auth/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/guards/auth/role.guard';
import { FileType } from 'src/models/movie/file-type.enum';
import { MyDriveService } from 'src/my-drive/my-drive.service';
import { Roles } from 'src/services/auth/role.annotaion';
import { Role } from 'src/services/auth/role.enum';

@Controller('files')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FileController {
  constructor(private driveService: MyDriveService) {}
  @Get()
  @Roles(Role.Admin, Role.User)
  async getFile(
    @Query('id') id: string,
    @Query('file_type') fileType: string,
  ) {}

  @Post('upload')
  @Roles(Role.Admin)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      limits: {
        fileSize: 3221225472,
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMovieFileDto,
  ) {
    console.log("~ file: file.controller.ts ~ FileController ~ uploadFile ~ body", body)
    try {
      const type = this.driveService.getFileType(body.type);
      const res = await this.driveService.uploadFile(file, body.name, type);
      console.log("~ file: file.controller.ts ~ FileController ~ uploadFile ~ res", res)
      return res;
    } catch (error: Error | any) {
      console.error(error);
      await this.driveService.removeTempFile(file.filename);
      if (error == OutOfRangeError || error.name === 'OutOfRangeError') {
        throw new HttpException(
          'Type is not support. (avatar | background | image | imgTitle | movie | trailer | series)',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Error while uploading file to cloud',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  @Roles(Role.Admin)
  @HttpCode(204)
  async removeFile(@Query('id') id: string) {
    let res: 1 | 0;
    try {
      res = await this.driveService.removeCloudFile(id);
    } catch (error) {
      throw new HttpException(
        'Could not remove file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (res === 1) {
      return;
    } else {
      throw new HttpException(
        'Could not remove file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
