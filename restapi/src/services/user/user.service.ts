import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/models/user/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { NotFoundError } from 'src/helpers/errors/not-found-error';
import { NullPointerError } from 'src/helpers/errors/null-pointer-error';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(sortAsc = true, limit = 0) {
    let query = this.userModel.find().sort({ _id: sortAsc ? 1 : -1 });
    query = limit > 0 ? query.limit(limit) : query;
    const list = await query.exec();

    list.forEach((element) => (element.password = undefined));

    if (!list || (Array.isArray(list) && list.length == 0)) {
      throw new NullPointerError();
    }
    return list;
  }

  async findOneByEmail(email: string) {
    const user = this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundError();
    }
    return user;
  }

  async findOneByUsername(username: string) {
    const user = this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundError();
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto);
    return createUser.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const oldInfo = await this.userModel.findOne({ _id: id }).exec();
    oldInfo.set(updateUserDto);
    return oldInfo.save();
  }

  async detele(id: string) {
    return await this.userModel.deleteOne({ _id: id }).exec();
  }

  async findOneById(id: string) {
    const user = this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new NotFoundError();
    }
    return user;
  }


  //get the number of users by month
  async getStats() {
    const today = new Date();
    // const lastYear = today.setFullYear(today.getFullYear() - 1);

    return this.userModel.aggregate([
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ]).exec();
  }
}
