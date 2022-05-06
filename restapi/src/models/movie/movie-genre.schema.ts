import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Movie } from "./movie.schema";

export type MovieGenreDocument = MovieGenre & Document;

@Schema({
    timestamps: true
})
export class MovieGenre {

    @Prop({required: true, unique: true})
    genreId: string;

    @Prop({required: true, unique: true})
    genre: string;

    @Prop({required: true})
    desc: string;
}

export const MovieGenreSchema = SchemaFactory.createForClass(MovieGenre);