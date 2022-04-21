import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/models/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { NotFoundError } from 'src/helpers/errors/not-found-error';
import { NullPointerError } from 'src/helpers/errors/null-pointer-error';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async findAll(): Promise<User[]> {
        const list = this.userModel.find().exec();
        if(!list || (Array.isArray(list) && list.length == 0)) {
            throw new NullPointerError();            
        }
        return list;
    }

    async findOneByEmail(email: string): Promise<User> {
        const user = this.userModel.findOne({email}).exec();
        if(!user) {
            throw new NotFoundError();
        }        
        return user;
    }

    async findOneByUsername(username: string): Promise<User> {
        const user = this.userModel.findOne({username}).exec();
        if(!user) {
            throw new NotFoundError();
        }
        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createUser = new this.userModel(createUserDto);
        return createUser.save();
    }
}
