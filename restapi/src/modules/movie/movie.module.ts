import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieController } from 'src/controllers/movie/movie.controller';
import { Movie, MovieSchema } from 'src/models/movie/movie.schema';
import { MovieService } from 'src/services/movie/movie.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MongooseModule, MovieModule]
})
export class MovieModule {}
