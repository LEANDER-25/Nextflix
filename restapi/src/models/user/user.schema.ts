import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  // @Prop({ type: mongoose.Types.ObjectId })
  // _id: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  profilePic: string;

  @Prop({ default: false })
  isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
