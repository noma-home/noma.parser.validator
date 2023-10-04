import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

import { CurrencyEnum } from "@advert";

export class PriceDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    public uah?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    public usd?: number;

    @IsNotEmpty()
    @IsString()
    @IsEnum(CurrencyEnum)
    public currency: CurrencyEnum;
}
