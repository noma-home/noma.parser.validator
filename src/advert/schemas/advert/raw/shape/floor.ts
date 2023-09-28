import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Floor {
    @Prop({
        type: Number,
        min: 0,
        description: "Кількість поверхів",
    })
    numberOfFloors: number;

    @Prop({ type: Number, min: 0, description: "Поверх" })
    itemFloor: number;

    @Prop({ type: Boolean, default: false, description: "Цикольний поверх" })
    isZeroLevelFloor: boolean;
}
