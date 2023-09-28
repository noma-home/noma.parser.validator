import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Status {
    @Prop({ type: Boolean, default: false, description: "Shows is advert a copy of another advert" })
    isCopy: boolean;
}
