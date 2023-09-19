import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

import { RawData } from "./raw-data.schema";
import { Origin } from "./origin.schema";
import { NomaData } from "./noma-data.schema";

export type AdvertDocument = HydratedDocument<Advert>;

@Schema()
export class Advert {
    @Prop({ type: [{ type: Types.ObjectId, ref: Advert.name }], default: [] })
    duplicates: Types.ObjectId[];

    @Prop({ type: Boolean, default: false })
    isCopy: boolean;

    @Prop({ type: [Origin], default: [] })
    origins: Origin[];

    @Prop({ type: RawData, required: true })
    raw: RawData;

    @Prop({ type: NomaData, default: () => new NomaData() })
    noma: NomaData;
}

export const AdvertSchema = SchemaFactory.createForClass(Advert);

// function objectToHash(obj: Object): number {
//     const str = JSON.stringify(obj);
//     let h: number = 0;
//     for (let i = 0; i < str.length; i++) {
//         h = 31 * h + str.charCodeAt(i);
//     }
//     return h & 0xFFFFFFFF
// }
