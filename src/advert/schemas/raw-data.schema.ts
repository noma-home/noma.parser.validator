import { Schema as MongooseSchema } from "mongoose";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class RawData {
  @Prop({ type: Number, required: true })
  hash: number;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  data: Object;
}
