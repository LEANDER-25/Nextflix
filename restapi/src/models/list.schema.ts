import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Movie } from './movie.schema';

export type ListDocument = List & Document;

@Schema({
  timestamps: true,
})
export class List {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop()
  type: string;

  @Prop()
  genre: string;

  @Prop([Movie])
  content: Movie[];
}

export const ListSchema = SchemaFactory.createForClass(List);
