import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Origin {
    @Prop({ type: String, required: true, description: "Resource of advert" })
    resource: string;

    @Prop({ type: String, required: true, description: "Adverts URL on resource" })
    url: string;

    @Prop({ type: String, description: "Adverts ID on resource" })
    id?: string;

    @Prop({ type: Date, required: true, description: "Date when advert was created on resource" })
    created: Date;

    @Prop({ type: Date, required: true, description: "Date when advert was updated on resource" })
    lastUpdate: Date;

    @Prop({ type: Date, default: () => new Date(), description: "Date when seller phone was parsed on resource" })
    lastPhoneUpdate: Date;
}
