import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeriesController } from 'src/controllers/series/series.controller';
import { Series, SeriesSchema } from 'src/models/series/series.schema';
import { SeriesService } from 'src/services/series/series.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Series.name, schema: SeriesSchema }]),
  ],
  providers: [SeriesService],
  controllers: [SeriesController]
})
export class SeriesModule {}
