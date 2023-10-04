import { ParseResponseDto } from "./parse.response.dto";
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { $Advert, $Parse } from "@types";
import { CategoryEnum, OperationEnum } from "@advert";

class ResponseDataDto {
    @IsNotEmpty()
    @IsString({ each: true })
    @IsArray()
    public adverts: string[];
}

class RequestDataDto {
    @IsNotEmpty()
    @IsNumber()
    public limit: number;

    @IsNotEmpty()
    @IsString()
    @IsEnum(CategoryEnum)
    public category: CategoryEnum;

    @IsNotEmpty()
    @IsString()
    @IsEnum(OperationEnum)
    public operation: OperationEnum;
}

class RequestDto {
    pattern: "parse:latest" = "parse:latest";

    @ValidateNested()
    public data: RequestDataDto;
}

export class ParseLatestResponseDto extends ParseResponseDto {
    @IsNotEmpty()
    @ValidateNested()
    public request: RequestDto;

    @IsNotEmpty()
    @IsObject()
    public data: ResponseDataDto;
}
