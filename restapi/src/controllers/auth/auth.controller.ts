import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { LocalAuthenticationGuard } from 'src/middlewares/guards/auth/local-auth.guard';
import { AuthService } from 'src/services/auth/auth.service';
import RequestWithUser from '../../dtos/user/request-with-user';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registrationInfo: CreateUserDto) {
    try {
      return this.authService.register(registrationInfo);
    } catch (error) {
      console.log('Register Controller Error');
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@Req() req: RequestWithUser) {
    const user = req.user;
    user.password = undefined;
    return user;
  }
}
