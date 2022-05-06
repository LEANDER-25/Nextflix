import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MovieGenre,
  MovieGenreDocument,
} from 'src/models/movie/movie-genre.schema';
import { Model } from 'mongoose';
import { NullPointerError } from 'src/helpers/errors/null-pointer-error';
import { NotFoundError } from 'src/helpers/errors/not-found-error';

@Injectable()
export class MovieGenreService {
  constructor(
    @InjectModel(MovieGenre.name)
    private movieGenreModel: Model<MovieGenreDocument>,
  ) {}

  async findAll() {
    const list = await this.movieGenreModel.find().sort({genre: 1}).exec();
    if (!list || (Array.isArray(list) && list.length == 0)) {
      throw new NullPointerError();
    }
    return list;
  }

  async findById(id: string) {
    const genre = await this.movieGenreModel.findOne({ genreId: id }).exec();
    if (!genre) {
      throw new NotFoundError();
    }
    return genre;
  }

  async findByName(genre: string) {
    const list = await this.movieGenreModel
      .find({ genre: { $regex: `.*${genre}.*` } })
      .exec();
    if (!list || (Array.isArray(list) && list.length == 0)) {
      throw new NullPointerError();
    }
    return list;
  }
}
