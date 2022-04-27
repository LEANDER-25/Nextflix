import { Module } from '@nestjs/common';
import { MyDriveService } from './my-drive.service';

@Module({
  providers: [MyDriveService]
})
export class MyDriveModule {}
