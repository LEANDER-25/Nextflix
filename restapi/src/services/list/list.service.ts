import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateListDto } from 'src/dtos/list/create-list.dto';
import { List, ListDocument } from 'src/models/list/list.schema';
import { Model } from 'mongoose';
import * as md5 from 'md5';
import { MovieGenre, MovieGenreDocument } from 'src/models/movie/movie-genre.schema';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name) private listModel: Model<ListDocument>,
    @InjectModel(MovieGenre.name) private movieGenreModel: Model<MovieGenreDocument>
    ) {}

  async create(createListDto: CreateListDto) {
    const now  = new Date();
    const findGenre = await this.movieGenreModel.findOne({genre: createListDto.genre}).exec();
    const newList: List = {
      listId: md5(now),
      genre: findGenre,
      title: createListDto.title,
      type: createListDto.type,
      content: createListDto.content
    }
    const createList = new this.listModel(newList);
    return createList.save();
  }

  async delete(id: string) {
    return await this.listModel.deleteOne({ _id: id }).exec();
  }

  async filterList(type: string, genre: string) {
    let list = [];
    if (type) {
      if (genre) {
        list = await this.listModel.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: type, genre: genre } },
        ]);
      } else {
        list = await this.listModel.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: type } },
        ]);
      }
    } else {
      list = await this.listModel.aggregate([{ $sample: { size: 10 } }]);
    }
    return list;
  }
}
