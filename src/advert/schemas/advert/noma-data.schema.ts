import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class NomaData {
    @Prop({ type: String, description: "Advert ID on Noma" })
    id: string;

    @Prop({ type: Date, description: "Date when advert was published on Noma" })
    lastUpdate: Date;
}
