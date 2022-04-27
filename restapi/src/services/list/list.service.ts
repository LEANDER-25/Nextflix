import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateListDto } from 'src/dtos/list/create-list.dto';
import { List, ListDocument } from 'src/models/list/list.schema';
import { Model } from 'mongoose';

@Injectable()
export class ListService {
  constructor(@InjectModel(List.name) private listModel: Model<ListDocument>) {}

  async create(createListDto: CreateListDto) {
    const createList = new this.listModel(createListDto);
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
