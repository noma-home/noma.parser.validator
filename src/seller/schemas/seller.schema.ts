import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

import { Account } from "./account.schema";

export type SellerDocument = HydratedDocument<Seller>;

@Schema()
export class Seller {
    @Prop({ type: Account, description: "Профіль користувача" })
    account: Account;

    @Prop({ type: Boolean, default: false })
    isRealtor: boolean;
}

export const SellerSchema = SchemaFactory.createForClass(Seller);
