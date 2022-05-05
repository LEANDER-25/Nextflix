import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import RequestWithUser from 'src/dtos/user/request-with-user';
import { JwtAuthGuard } from 'src/middlewares/guards/auth/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/guards/auth/role.guard';
import { Roles } from 'src/services/auth/role.annotaion';
import { Role } from 'src/services/auth/role.enum';
import { MovieService } from 'src/services/movie/movie.service';
import { DeleteResult } from 'mongodb';
import { NullPointerError } from 'src/helpers/errors/null-pointer-error';
import { NotFoundError } from 'src/helpers/errors/not-found-error';

@Controller('movies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Req() req: RequestWithUser) {
    try {
      const body = req.body;
      const created = await this.movieService.create(body);
      return created;
    } catch (error) {
      console.error(error);
      if (error.name === 'NotFoundError' || error == NotFoundError) {
        throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Error while creating new movie...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(@Req() req: RequestWithUser) {
    if (!req.params.id) {
      throw new HttpException('Missing id of movie', HttpStatus.BAD_REQUEST);
    }
    try {
      const body = req.body;
      const updated = await this.movieService.update(req.params.id, body);
      return updated;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error while updating movie',
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
    let deletedMovie: DeleteResult;
    try {
      deletedMovie = await this.movieService.delete(id);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error while removing movie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (deletedMovie.deletedCount === 1) {
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

  @Get('find/:id')
  @Roles(Role.Admin, Role.User)
  async findOne(@Param('id') id: string) {
    if (!id) {
      throw new HttpException('Missing id of movie', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.movieService.findOneById(id);
    } catch (error) {
      console.error(error);
      if (error.name === 'NotFoundError') {
        throw new HttpException('Can not find the movie', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error while finding movie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/random')
  @Roles(Role.Admin, Role.User)
  async findRandom(@Query('type') type: string) {
    try {
      const isSeries = type === 'series' ? true : false;

      const randomMovies = await this.movieService.findRandom(isSeries);
      return randomMovies;
    } catch (error) {
      console.error(error);
      if (error.name === 'NullPointerError' || error == NullPointerError) {
        throw new HttpException('Can not find the movie', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error while finding movie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @Roles(Role.Admin)
  async findAll() {
    try {
      return await this.movieService.findAll();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error while retrieving movies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
