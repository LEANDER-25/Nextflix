import { Movie } from "src/models/movie/movie.schema";

export class CreateListDto {
    title: string;
    type: string;
    genre: string;
    content: Movie[]
}