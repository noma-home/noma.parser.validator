import { Prop, Schema } from "@nestjs/mongoose";
import { Schema as MongoSchema } from "mongoose";

import { $Advert } from "@types";
import { CategoryEnum, OperationEnum } from "@advert/enums";

import { Area } from "./area";
import { Price } from "./price";
import { Shape } from "./shape";
import { Anagraph } from "./anagraph";
import { Location } from "./location";

@Schema({ _id: false })
export class Data {
    @Prop({
        type: String,
        enum: CategoryEnum,
        description: "Категорія",
        required: true,
    })
    category: CategoryEnum;

    @Prop({
        type: String,
        enum: OperationEnum,
        description: "Операція",
        required: true,
    })
    operation: OperationEnum;

    @Prop({ type: Area })
    area: Area;

    @Prop({ type: Price })
    price: Price;

    @Prop({ type: Anagraph })
    anagraph: Anagraph;

    @Prop({ type: Location })
    location: Location;

    @Prop({ type: Shape })
    shape: Shape;

    @Prop({ type: [String], required: true })
    images: string[];

    @Prop({
        type: [MongoSchema.Types.Mixed],
        description: "Побутова техніка",
        default: [],
    })
    householdAppliances: $Advert.$AnyTag[];

    @Prop({
        type: [MongoSchema.Types.Mixed],
        description: "Мультимедія",
        default: [],
    })
    multimedia: $Advert.$AnyTag[];

    @Prop({
        type: [MongoSchema.Types.Mixed],
        description: "Додатково",
        default: [],
    })
    extra: $Advert.$AnyTag[];
}
