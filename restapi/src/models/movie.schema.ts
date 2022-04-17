import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({
  timestamps: true,
})
export class Movie {
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

  @Prop()
  genre: string;

  @Prop({default: false})
  isSeries: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
