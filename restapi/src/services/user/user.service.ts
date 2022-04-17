import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/models/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOneByEmail(email: string): Promise<User> {
        return this.userModel.findOne({email}).exec();
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createUser = new this.userModel(createUserDto);
        return createUser.save();
    }
}
