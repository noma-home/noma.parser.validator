import { ParseResponseDto } from "./parse.response.dto";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
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

    @IsNotEmpty()
    @IsString({ each: true })
    @IsArray()
    public data: string[];
}

export class ParseLatestResponseDto extends ParseResponseDto {
    @IsNotEmpty()
    @ValidateNested()
    public request: RequestDto;

    @IsNotEmpty()
    @IsString({ each: true })
    @IsArray()
    public data: string[];
}
