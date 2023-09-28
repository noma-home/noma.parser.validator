import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Additional {
    @Prop({ type: Boolean, description: "Балкон" })
    balcony: boolean;

    @Prop({ type: Boolean, description: "Тераса" })
    terrace: boolean;

    @Prop({ type: Boolean, description: "Лоджія" })
    loggia: boolean;

    @Prop({ type: Number, min: 0, description: "Загальна кількість" })
    totalNumber: number;
}
