import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { NotFoundError } from 'src/helpers/errors/not-found-error';
import { NullPointerError } from 'src/helpers/errors/null-pointer-error';
import { JwtAuthGuard } from 'src/middlewares/guards/auth/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/guards/auth/role.guard';
import { Roles } from 'src/services/auth/role.annotaion';
import { Role } from 'src/services/auth/role.enum';
import { SeriesService } from 'src/services/series/series.service';

@Controller('series')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SeriesController {
  constructor(private seriesService: SeriesService) {}

  @Get()
  @Roles(Role.Admin, Role.User)
  async findAll() {
    try {
      return await this.seriesService.findAll();
    } catch (error) {
      console.error(error);
      throw new HttpException('No series', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('find/:id')
  @Roles(Role.Admin, Role.User)
  async findById(@Param('id') id: string) {
    try {
      return await this.seriesService.findById(id);
    } catch (error) {
      console.error(error);
      if (error == NotFoundError || error.name === 'NotFoundError') {
        throw new HttpException('Not found series', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error while finding series',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('relate/:title')
  @Roles(Role.Admin, Role.User)
  async findRelate(@Param('title') title: string) {
    try {
      return await this.seriesService.findRelateByMovieTitle(title);
    } catch (error) {
      console.error(error);
      if (error == NotFoundError || error.name === 'NotFoundError') {
        throw new HttpException('Not found series', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error while finding series',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
