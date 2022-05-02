import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/models/user/user.schema';
import { IllegalInformationError } from 'src/helpers/errors/iIllegal-information-error';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registrationInfo: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(registrationInfo.password, 10);
      registrationInfo.password = hashedPassword;
      const registered = await this.userService.create(registrationInfo);
      registered.password = undefined;
      return registered;
    } catch (error) {
      console.error(error);
      // console.log(error.name);
      // console.log(error.message);
      // console.log(error.code);
      if (error.code === 11000) {
        throw new HttpException('Existed Email', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }
  async authUser(email: string, password: string) {
    try {
      const user = await this.userService.findOneByEmail(email);
      console.log('authUser');      
      console.log(user);
      console.log('and user id:');
      console.log(user._id.toString());
      
      await this.verifyPassword(password, user.password);
      user.password = undefined;
      const token = await this.generateToken(user);
      return {
        user: {
          _id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
        accessToken: token,
      };
    } catch (error) {
      console.error(error);
      // throw new IllegalInformationError();
      throw new HttpException(
        'Wrong password or email!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyPassword(loginPwd, storedPwd) {
    const isPasswordMatching = await bcrypt.compare(loginPwd, storedPwd);

    if (!isPasswordMatching) {
      // throw new IllegalInformationError();
      throw new HttpException(
        'Wrong password or email!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async generateToken(user: UserDocument) {
    const payload = {
      userid: user._id.toString(),
      username: user.username,
      email: user.email,
    };
    console.log(payload);
    const token = await this.jwtService.signAsync(payload);
    console.log(`token: ${token}`);
    return token;
  }

  generateClientID(user: User, userAgent: string) {

  }
}
