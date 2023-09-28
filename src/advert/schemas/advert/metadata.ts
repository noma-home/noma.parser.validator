import { Schema as MongooseSchema } from "mongoose";
import { Prop, Schema } from "@nestjs/mongoose";

import { ParseHistory } from "./parse-history";
import { NomaData } from "./noma-data.schema";
import { Origin } from "./origin.schema";

@Schema({ _id: false })
export class Metadata {
    @Prop({ type: [ParseHistory], default: [], description: "Stores history of parsing" })
    parsingHistory: ParseHistory[];

    @Prop({ type: MongooseSchema.Types.Mixed, default: {}, description: "Stores all references on resources" })
    origins: Record<string, Origin>;

    @Prop({ type: NomaData })
    noma: NomaData;
}
