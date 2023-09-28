import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

import { objectToHash } from "@utils";
import { Seller } from "@seller/schemas";

import { Metadata } from "./metadata";
import { Status } from "./status";
import { RawData } from "./raw";

export type AdvertDocument = HydratedDocument<Advert>;

@Schema()
export class Advert {
    @Prop({ type: RawData, required: true, description: "Advert data object, contains raw data from parser and hash" })
    data: RawData;

    @Prop({ type: Status, required: true })
    status: Status;

    @Prop({ type: Metadata, required: true })
    metadata: Metadata;

    @Prop({ type: Types.ObjectId, ref: Seller.name, description: "Reference to seller" })
    seller: Types.ObjectId;

    @Prop({
        type: [{ type: Types.ObjectId, ref: Advert.name }],
        default: [],
        description: "Array of duplicates of advert",
    })
    duplicates: Types.ObjectId[];
}

const _AdvertSchema = SchemaFactory.createForClass(Advert);

_AdvertSchema.pre<Advert>("save", function (next) {
    if (this.data && this.data.raw) {
        const rawDataHash = objectToHash(this.data.raw);
        this.data.hash = rawDataHash;
    }
    next();
});

export const AdvertSchema = _AdvertSchema;
