import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { ConditionEnum, HeatingEnum, LayoutEnum } from "@advert";

import { AdditionalDto } from "./additional.dto";
import { FloorDto } from "./floor.dto";
import { RoomDto } from "./room.dto";

export class ItemDto {
    @IsNotEmpty({ message: () => "" })
    @ValidateNested()
    @Type(() => RoomDto)
    public room: RoomDto;

    @IsOptional()
    @IsEnum(LayoutEnum, { message: () => "" })
    public layout: LayoutEnum;

    @IsOptional()
    @IsEnum(HeatingEnum, { message: () => "" })
    public heating: string;

    @IsOptional()
    @IsEnum(ConditionEnum, { message: () => "" })
    public condition: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => FloorDto)
    public floor: FloorDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => AdditionalDto)
    public additional: AdditionalDto;

    @IsOptional()
    @IsBoolean()
    public pantry: boolean;

    @IsOptional()
    @IsBoolean()
    public basement: boolean;
}
