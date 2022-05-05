import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController } from 'src/controllers/list/list.controller';
import { List, ListSchema } from 'src/models/list/list.schema';
import { MovieGenre, MovieGenreSchema } from 'src/models/movie/movie-genre.schema';
import { ListService } from 'src/services/list/list.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: List.name, schema: ListSchema },
      { name: MovieGenre.name, schema: MovieGenreSchema },
    ]),
  ],
  controllers: [ListController],
  providers: [ListService],
  exports: [MongooseModule, ListService],
})
export class ListModule {}
