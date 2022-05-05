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

  @Prop()
  img: string;

  @Prop()
  imgTitle: string;

  @Prop()
  imgSm: string;

  @Prop()
  trailer: string;

  @Prop()
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
