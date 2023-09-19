import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class NomaData {
  @Prop({ type: String })
  id: string;

  @Prop({ type: Date })
  lastUpdate: Date;
}
