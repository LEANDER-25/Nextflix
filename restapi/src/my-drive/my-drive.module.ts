import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MyDriveService } from './my-drive.service';

@Module({
  imports: [ConfigModule],
  providers: [MyDriveService],
  exports: [MyDriveService]
})
export class MyDriveModule {}
