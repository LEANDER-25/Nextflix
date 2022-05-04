import { Prop, Schema } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class Series {
    @Prop({required: true, unique: true})
    title: string;

    @Prop({required: true})
    ep: number;
}