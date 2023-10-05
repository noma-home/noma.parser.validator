import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Location {
    @Prop({ type: String })
    region: string;

    @Prop({ type: String })
    subRegion?: string;

    @Prop({ type: String })
    settlement?: string;

    @Prop({ type: String })
    district?: string;

    @Prop({ type: String })
    street?: string;

    @Prop({ type: String })
    address?: string;
}
