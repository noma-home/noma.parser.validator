import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class ParseHistory {
    @Prop({ type: String, required: true, description: "Parsed resource" })
    resource: string;

    @Prop({ type: Date, required: true, description: "Date of procedure" })
    date: Date;
}
