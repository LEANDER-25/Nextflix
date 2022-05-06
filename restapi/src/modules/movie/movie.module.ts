import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieGenreController } from 'src/controllers/movie/movie-genre.controller';
import { MovieController } from 'src/controllers/movie/movie.controller';
import {
  MovieGenre,
  MovieGenreSchema,
} from 'src/models/movie/movie-genre.schema';
import { Movie, MovieSchema } from 'src/models/movie/movie.schema';
import { MovieGenreService } from 'src/services/movie/movie-genre.service';
import { MovieService } from 'src/services/movie/movie.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: MovieGenre.name, schema: MovieGenreSchema }
    ]),
  ],
  controllers: [MovieController, MovieGenreController],
  providers: [MovieService, MovieGenreService],
  exports: [MongooseModule, MovieService, MovieGenreService],
})
export class MovieModule {}
