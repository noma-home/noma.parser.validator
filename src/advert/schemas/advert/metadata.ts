import { Prop, Schema } from "@nestjs/mongoose";

import { ParseHistory, ParseHistorySchema } from "./parse-history";
import { NomaData } from "./noma-data.schema";
import { Origin, OriginSchema } from "./origin.schema";

@Schema({ _id: false })
export class Metadata {
    @Prop({ type: [ParseHistorySchema], default: [], description: "Stores history of parsing" })
    parsingHistory: ParseHistory[];

    @Prop({ type: [OriginSchema], default: [], description: "Stores all references on resources" })
    origins: Origin[];

    @Prop({ type: NomaData, default: {} })
    noma: NomaData;
}
