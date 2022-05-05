import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { NotFoundError } from 'src/helpers/errors/not-found-error';
import { JwtAuthGuard } from 'src/middlewares/guards/auth/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/guards/auth/role.guard';
import { Roles } from 'src/services/auth/role.annotaion';
import { Role } from 'src/services/auth/role.enum';
import { MovieGenreService } from 'src/services/movie/movie-genre.service';

@Controller('genres')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MovieGenreController {
  constructor(private movieGenreService: MovieGenreService) {}

  @Get()
  @Roles(Role.Admin, Role.User)
  async findAll() {
    try {
      const list = await this.movieGenreService.findAll();
      return list;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error while get all genres or data not imported',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('find/:id')
  @Roles(Role.Admin, Role.User)
  async findById(@Param('id') id: string) {
    try {
      const genre = await this.findById(id);
      return genre;
    } catch (error) {
      console.error(error);
      if (error.name === 'NotFoundError' || error == NotFoundError) {
        throw new HttpException('Not Found Genre', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error while finding the genre',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
