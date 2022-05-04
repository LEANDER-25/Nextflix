import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from 'src/models/movie/movie.schema';
import { Model } from 'mongoose';
import { NullPointerError } from 'src/helpers/errors/null-pointer-error';
import { NotFoundError } from 'src/helpers/errors/not-found-error';
import { CreateMovieDto } from 'src/dtos/movie/create-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  async findAll() {
    const list = await this.movieModel.find().exec();
    if (!list || (Array.isArray(list) && list.length == 0)) {
      throw new NullPointerError();
    }
    return list;
  }

  async findOneById(id: string) {
    const movie = await this.movieModel.findById(id).exec();
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
    const createMovie = new this.movieModel(createMovieDto);
    return createMovie.save();
  }

  async update(id: string, updateMovieDto: CreateMovieDto) {
    const oldInfo = await this.movieModel.findById(id).exec();
    oldInfo.set(updateMovieDto);
    return oldInfo.save();
  }

  async delete(id: string) {
    return await this.movieModel.deleteOne({ _id: id }).exec();
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
}
