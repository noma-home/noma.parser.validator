import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Anagraph {
    @Prop({ type: String, required: true, description: "Заголовок" })
    title: string;

    @Prop({ type: String, required: true, description: "Опис" })
    description: string;
}
