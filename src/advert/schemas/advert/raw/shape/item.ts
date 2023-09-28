import { Prop, Schema } from "@nestjs/mongoose";

import { ConditionEnum, HeatingEnum, LayoutEnum } from "@advert/enums";

import { Additional } from "./addintional";
import { Floor } from "./floor";
import { Room } from "./room";

@Schema({ _id: false })
export class Item {
    @Prop({ type: Room })
    room: Room;

    @Prop({
        type: String,
        enum: LayoutEnum,
        description: "Планування",
    })
    layout: LayoutEnum;

    @Prop({
        type: String,
        enum: HeatingEnum,
        description: "Опалення",
    })
    heating: HeatingEnum;

    @Prop({
        type: String,
        enum: ConditionEnum,
        description: "Стан",
    })
    condition: ConditionEnum;

    @Prop({ type: Floor })
    floor: Floor;

    @Prop({ type: Additional })
    additional: Additional;

    @Prop({ type: Boolean, description: "Комора" })
    pantry: boolean;

    @Prop({ type: Boolean, description: "Підвал" })
    basement: boolean;
}
