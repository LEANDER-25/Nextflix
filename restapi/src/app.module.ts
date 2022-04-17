import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AquafinaModule } from './aquafina/aquafina.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/nextflix'), AquafinaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
