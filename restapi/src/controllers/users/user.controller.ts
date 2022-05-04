import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import RequestWithUser from 'src/dtos/user/request-with-user';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { NotFoundError } from 'src/helpers/errors/not-found-error';
import { JwtAuthGuard } from 'src/middlewares/guards/auth/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/guards/auth/role.guard';
import { User } from 'src/models/user/user.schema';
import { Roles } from 'src/services/auth/role.annotaion';
import { Role } from 'src/services/auth/role.enum';
import { UserService } from 'src/services/user/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async updateUserInfo(@Req() req: RequestWithUser) {
    console.log('user id:: ');
    console.log(req.user._id.toString());

    console.log('param id:: ');
    console.log(req.params.id);

    if (req.user._id.toString() === req.params.id || req.user.isAdmin) {
      if (!req.body) {
        throw new HttpException('Empty Payload', HttpStatus.BAD_REQUEST);
      }
      const updateDto = req.body;
      if (updateDto.isAdmin !== undefined) {
        if (!req.user.isAdmin) {
          throw new HttpException(
            'Permission is not allowed',
            HttpStatus.FORBIDDEN,
          );
        }
      }
      try {
        return await this.userService.update(req.user._id, updateDto);
      } catch (error) {
        console.error(error);
        throw new HttpException(
          'Error while updating',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new HttpException(
        'Can not update another user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async deleteUser(@Req() req: RequestWithUser) {
    if (req.user._id.toString() === req.params.id || req.user.isAdmin) {
      try {
        const result = await this.userService.detele(req.params.id);
        console.log(result);
        if (result.deletedCount === 1) {
          return {
            message: 'User is deleted...',
          };
        } else {
          throw new NotFoundError('Can not find user or user is not existed');
        }
      } catch (error) {
        console.error(error);
        if (error.name === 'NotFoundError') {
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
        throw new HttpException(
          'Error while updating',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new HttpException(
        'Can not remove another user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('find/:id')
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.findOneById(id);
      user.password = undefined;
      return user;
    } catch (error) {
      console.log(error);
      if (error.name === 'NotFoundError') {
        throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error while finding user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getAllUsers(@Req() req: RequestWithUser) {
    const sortNewest = req.query.new === undefined ?? false;
    console.log(`In UserController > getAllUser > new=${sortNewest}`);

    try {
      return sortNewest
        ? await this.userService.findAll(false, 5)
        : await this.userService.findAll();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error while retrieving users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats')
  async getStats() {
    try {
      const data = await this.userService.getStats();
      return data;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error while retrieving stats',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
