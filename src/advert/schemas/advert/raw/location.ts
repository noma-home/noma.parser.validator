import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Location {
    @Prop({ type: String, required: true })
    region: string;

    @Prop({ type: String })
    subRegion: string;

    @Prop({ type: String, required: true })
    settlement: string;

    @Prop({ type: String })
    district: string;

    @Prop({ type: String })
    string: string;

    @Prop({ type: String, required: true })
    address: string;
}
