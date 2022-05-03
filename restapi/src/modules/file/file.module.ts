import { Module } from '@nestjs/common';
import { FileController } from 'src/controllers/files/file.controller';
import { MyDriveModule } from 'src/my-drive/my-drive.module';

@Module({
  imports: [MyDriveModule],
  controllers: [FileController],
})
export class FileModule {}
