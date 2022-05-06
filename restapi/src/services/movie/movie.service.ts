import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from 'src/models/movie/movie.schema';
import { Model } from 'mongoose';
import { NullPointerError } from 'src/helpers/errors/null-pointer-error';
import { NotFoundError } from 'src/helpers/errors/not-found-error';
import { CreateMovieDto } from 'src/dtos/movie/create-movie.dto';
import {
  MovieGenre,
  MovieGenreDocument,
} from 'src/models/movie/movie-genre.schema';
import * as md5 from 'md5';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(MovieGenre.name)
    private movieGenreModel: Model<MovieGenreDocument>,
  ) {}

  async findAll() {
    const list = await this.movieModel.find().exec();
    if (!list || (Array.isArray(list) && list.length == 0)) {
      throw new NullPointerError();
    }
    return list;
  }

  async findOneById(id: string) {
    const movie = await this.movieModel.findOne({ movieId: id }).exec();
    if (!movie) {
      throw new NotFoundError();
    }
    return movie;
  }

  /**
   * NEW CREATE LOGIC
   * -------------------------------------------------------------
   * create empty document of movie with movie name and desc in db
   * * create the array of objects: store
   * * * {<attribute_in_model>: <file>, <media_type>: <string>, <size_in_byte>: <double>}
   * * * { image: "86.jpg", mediaType: "image/jpg", size: 5000000}
   * upload files( trailer, images, video) to Google Drive
   * * store with name is document id of the movie was stored in db
   * * select upload type by size of file: <= 5MB: multipart, >5MB: resumable
   * get view link of each file
   * update the document( add missing link to rest attributes)
   * find and return the updated document
   **/
  async create(createMovieDto: CreateMovieDto) {
    const genre = await this.movieGenreModel
      .findOne({ genre: createMovieDto.genre })
      .exec();
    if (!genre) {
      throw new NotFoundError('Not Found Genre');
    }
    const newMovie = {
      movieId: md5(new Date()),
      genre,
      title: createMovieDto.title,
      limit: createMovieDto.limit,
      year: createMovieDto.year,
      isSeries: createMovieDto.isSeries,
      desc: createMovieDto.desc
    }

    const createMovie = new this.movieModel(newMovie);
    return createMovie.save();
  }

  async update(id: string, updateMovieDto: CreateMovieDto) {
    const oldInfo = await this.movieModel.findOne({movieId: id}).exec();
    oldInfo.set(updateMovieDto);
    return oldInfo.save();
  }

  async delete(id: string) {
    return await this.movieModel.deleteOne({ movieId: id }).exec();
  }

  async findRandom(isTypeSeries = false) {
    const randomMovies = await this.movieModel
      .aggregate([
        { $match: { isSeries: isTypeSeries } },
        { $sample: { size: 1 } },
      ])
      .exec();

    if (
      !randomMovies ||
      (Array.isArray(randomMovies) && randomMovies.length == 0)
    ) {
      throw new NullPointerError();
    }

    return randomMovies;
  }

  async findByGenre(genreId: string) {
    const list = await this.movieModel.find({genre: {genreId}}).exec();
    if (!list || (Array.isArray(list) && list.length == 0)) {
      throw new NotFoundError();
    }
    return list;
  }
}
