import { Injectable } from '@nestjs/common';
import { Series, SeriesDocument } from 'src/models/series/series.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NullPointerError } from 'src/helpers/errors/null-pointer-error';
import { NotFoundError } from 'src/helpers/errors/not-found-error';

@Injectable()
export class SeriesService {
  constructor(
    @InjectModel(Series.name) private seriesModel: Model<SeriesDocument>,
  ) {}

  async findAll() {
    const list = await this.seriesModel.find().exec();
    if (!list || (Array.isArray(list) && list.length == 0)) {
      throw new NullPointerError();
    }
    return list;
  }

  async findRelateByMovieTitle(title: string) {
    const list = await this.seriesModel.find({title: { $regex: '.*' + title + '.*'}}).exec();
    if (!list || (Array.isArray(list) && list.length == 0)) {
      throw new NotFoundError();
    }
    return list;
  }

  async findById(id: string) {
    const series = await this.seriesModel.findById(id).exec();
    if (!series) {
      throw new NotFoundError();
    }
    return series;
  }

  async updateNoEpisodeByOne(id) {
    const series = await this.seriesModel.findById(id).exec();
    const lastEp = series.episodes;
    series.set({ episode: lastEp + 1 });
    return series.save();
  }

  async deleteSeries(id: string) {
      return await this.seriesModel.findByIdAndDelete(id).exec();
  }
}
