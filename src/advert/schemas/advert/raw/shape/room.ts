import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Room {
    @Prop({
        type: Number,
        min: 0,
        description: "Кількість кімнат",
        required: true,
    })
    totalNumber: number;

    @Prop({ type: Number, min: 0, description: "Кількість ізольованих кімнат" })
    numberOfSeparated: number;

    @Prop({ type: Number, min: 0, description: "Висота стелі" })
    roomHeight: number;
}
