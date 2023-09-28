import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Area {
    @Prop({ type: Number, min: 0, description: "Загальна площа", required: true })
    total: number;

    @Prop({ type: Number, min: 0, description: "Площа кухні" })
    kitchen: number;

    @Prop({ type: Number, min: 0, description: "Житлова площа" })
    living: number;
}
