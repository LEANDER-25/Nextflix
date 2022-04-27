import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'mongodb';
import RequestWithUser from 'src/dtos/user/request-with-user';
import { JwtAuthGuard } from 'src/middlewares/guards/auth/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/guards/auth/role.guard';
import { Roles } from 'src/services/auth/role.annotaion';
import { Role } from 'src/services/auth/role.enum';
import { ListService } from 'src/services/list/list.service';

@Controller('lists')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ListController {
  constructor(private listService: ListService) {}
  @Post()
  @Roles(Role.Admin)
  async create(@Req() req: RequestWithUser) {
    const newList = req.body;
    try {
      const savedList = await this.listService.create(newList);
      return savedList;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error while creating list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string) {
    if (!id) {
      throw new HttpException('Missing id of movie', HttpStatus.BAD_REQUEST);
    }
    let deletedList: DeleteResult;
    try {
      deletedList = await this.listService.delete(id);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error while creating list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (deletedList.deletedCount === 1) {
      return {
        message: 'List is deleted...',
      };
    } else {
      throw new HttpException(
        'Can not find list or list is not existed',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get()
  @Roles(Role.Admin, Role.User)
  async getListByTypeOrGenre(
    @Query('type') type: string,
    @Query('genre') genre: string,
  ) {
    try {
      return await this.listService.filterList(type, genre);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error while creating list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
