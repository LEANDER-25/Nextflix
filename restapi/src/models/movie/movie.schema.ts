import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { MovieGenre } from './movie-genre.schema';

export type MovieDocument = Movie & Document;

@Schema({
  timestamps: true,
})
export class Movie {
  @Prop({ required: true, unique: true })
  movieId: string;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop()
  desc: string;

  @Prop({default: ''})
  img: string;

  @Prop({default: ''})
  imgTitle: string;

  @Prop({default: ''})
  imgSm: string;

  @Prop({default: ''})
  trailer: string;

  @Prop({default: ''})
  video: string;

  @Prop()
  year: string;

  @Prop()
  limit: number;

  @Prop({ required: true })
  genre: MovieGenre;

  @Prop({ default: false })
  isSeries: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
