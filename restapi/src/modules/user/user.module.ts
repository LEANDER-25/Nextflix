import { Catch, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from 'src/controllers/users/user.controller';
import { User, UserSchema } from 'src/models/user/user.schema';
import { UserService } from 'src/services/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule, UserService]
})
export class UserModule {}
