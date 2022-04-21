import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/user/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DemoController } from './controllers/users/demo.controller';
import { RolesGuard } from './middlewares/guards/auth/role.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nextflix'),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        JWT_ACCESS_EXPIRED: Joi.string().required(),
        JWT_REFRESH_EXPIRED: Joi.string().required(),
      }),
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController, DemoController],
  providers: [AppService],
})
export class AppModule {}
