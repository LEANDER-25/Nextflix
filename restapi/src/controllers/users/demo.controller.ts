import {
  Controller,
  Delete,
  Get,
  Post,
  Req,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import RequestWithUser from 'src/dtos/user/request-with-user';
import { JwtAuthGuard } from 'src/middlewares/guards/auth/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/guards/auth/role.guard';
import { Roles } from 'src/services/auth/role.annotaion';
import { Role } from 'src/services/auth/role.enum';
import { DriveAPIConfig } from 'src/configurations/drive-api.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyDriveService } from 'src/my-drive/my-drive.service';
import { FileType } from 'src/models/movie/file-type.enum';

@Controller('demo')
export class DemoController {
  constructor(private driveService: MyDriveService) {}

  @Get('get')
  // @UseGuards(JwtAuthGuard)
  async getHandler(@Req() req: RequestWithUser) {
    // const uri = this.configService.get('redirectUri');
    console.log(req.user);
    return {
      message: `Hello from getHandler, goto`,
    };
  }

  @Get('get2')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getHandler2(@Req() req: RequestWithUser) {
    // console.log(req.user);

    return {
      message: 'Hello from demo getHandler 2',
    };
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      limits: {
        fileSize: 3221225472,
      },
    }),
  )
  async uploadMediaFile(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log(file);
      const res = await this.driveService.uploadFile(file, 'nothing', FileType.Series);
      console.log(res.webViewLink);
      
    } catch (error) {
      console.error(error);
      console.log(file.filename);
      await this.driveService.removeTempFile(file.filename);
    }
  }
  @Delete('delete')
  async deleteFile() {
    try {
      await this.driveService.removeCloudFile('16KiIRHFV0uJsK0RMV-incrwO8DMTQdkM');
    } catch (error) {
      console.error(error);
    }
  }
}
