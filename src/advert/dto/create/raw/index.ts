import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { CategoryEnum, OperationEnum } from "@advert";

import { AnagraphDto } from "./anagraph.dto";
import { LocationDto } from "./location.dto";
import { PriceDto } from "./price.dto";
import { ShapeDto } from "./shape.dto";
import { AreaDto } from "./area.dto";

export class RawDto {
    @IsNotEmpty()
    @IsString()
    @IsEnum(CategoryEnum)
    public category: CategoryEnum;

    @IsNotEmpty()
    @IsString()
    @IsEnum(OperationEnum)
    public operation: OperationEnum;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => AreaDto)
    public area: AreaDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PriceDto)
    public price: PriceDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => AnagraphDto)
    public anagraph: AnagraphDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ShapeDto)
    public shape: ShapeDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => LocationDto)
    public location: LocationDto;

    @IsNotEmpty()
    @IsString({ each: true })
    @IsArray()
    public images: string[];

    @IsOptional()
    @IsArray()
    public householdAppliances: Object[];

    @IsOptional()
    @IsArray()
    public multimedia: Object[];

    @IsOptional()
    @IsArray()
    public extra: Object[];
}
