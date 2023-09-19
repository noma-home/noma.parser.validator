import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Origin {
    @Prop({ type: String, required: true })
    resource: string;

    @Prop({ type: String, required: true })
    url: string;

    @Prop({ type: String })
    id: string;

    @Prop({ type: Date, default: new Date() })
    lastParsed: Date;
}
