import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.json({ limit: '3gb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '3gb',
      extended: true
    }),
  );
  app.setGlobalPrefix('api');
  await app.listen(3001);
}
bootstrap();
