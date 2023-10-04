import { Prop, Schema } from "@nestjs/mongoose";

import { Data } from "./data.schema";

@Schema({ _id: false })
export class RawData {
    @Prop({
        type: Number,
        required: false,
        description: "Auto calculating field, stores hash of `data`, use to detect `data` changes",
    })
    hash: number;

    @Prop({ type: Data, required: true, description: "Stores parsed advert data" })
    raw: Data;
}
