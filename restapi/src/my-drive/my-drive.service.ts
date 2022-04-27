import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drive_v3, google } from 'googleapis';

@Injectable()
export class MyDriveService {

  drive: drive_v3.Drive;

  constructor(configService: ConfigService) {
    try {
      const oauth2client = new google.auth.OAuth2(
          configService.get('CLIENT_ID'),
          configService.get('CLIENT_SECRET'),
          configService.get('REDIRECT_URI')
      );
      oauth2client.setCredentials({refresh_token: configService.get('REFRESH_TOKEN')});
      this.drive = google.drive({
          version: 'v3',
          auth: oauth2client
      });
    } catch (error) {
      console.error(error);
    }
  }

  async setPublicFile() {}

  async uploadMultipart() {}

  async uploadResumable() {}

  async uploadFile() {}

  async removeFile() {}
}
