import { Prop, Schema } from "@nestjs/mongoose";
import { Building } from "@advert/schemas/advert/raw/shape/building";

import { Item } from "./item";

@Schema({ _id: false })
export class Shape {
    @Prop({ type: Item })
    item: Item;

    @Prop({ type: Building })
    building: Building;
}
