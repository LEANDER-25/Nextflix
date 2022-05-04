import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Movie } from '../movie/movie.schema';

export type SeriesDocument = Series & Document;

@Schema({
  timestamps: true,
})
export class Series {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  episodes: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] })
  movies: Movie[];
}

export const SeriesSchema = SchemaFactory.createForClass(Series);
