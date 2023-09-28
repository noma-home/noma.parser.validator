import { Prop, Schema } from "@nestjs/mongoose";

import { BuildingEnum, WallEnum } from "@advert/enums";

@Schema({ _id: false })
export class Building {
    @Prop({
        type: String,
        enum: BuildingEnum,
        description: "Тип будівлі",
    })
    buildingType: BuildingEnum;

    @Prop({
        type: String,
        enum: WallEnum,
        description: "Тип стін",
    })
    wall: WallEnum;

    @Prop({
        type: Number,
        min: 0,
        description: "Кількість поверхів",
    })
    numberOfFloors: number;

    @Prop({
        type: String,
        match: new RegExp(/^(19|20)\d{2}$/),
        description: "Рік побудови",
    })
    year: string;

    @Prop({ type: Boolean, description: "Ліфт" })
    elevator: boolean;
}
