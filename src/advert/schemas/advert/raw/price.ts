import { Prop, Schema } from "@nestjs/mongoose";
import { CurrencyEnum } from "@advert";

@Schema({ _id: false })
export class Price {
    @Prop({
        type: Number,
        min: 0,
        description: "Вартість у гривнях",
    })
    uah: number;

    @Prop({
        type: Number,
        min: 0,
        description: "Вартість у доларах США",
    })
    usd: number;

    @Prop({
        type: String,
        enum: CurrencyEnum,
        description: "Валюта",
        required: true,
    })
    currency: CurrencyEnum;
}
