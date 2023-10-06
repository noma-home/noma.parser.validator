import { ParseResponseDto } from "./parse.response.dto";
import { IsBoolean, IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";
import { $Advert, $Parse } from "@types";

class ResponseDataDto {
    advert: { data: $Advert.$Advert; metadata: $Parse.$AdvertMetadata };
    seller?: $Parse.$Seller;
}

class RequestDataDto {
    @IsNotEmpty()
    @IsString()
    public id: string;

    @IsNotEmpty()
    @IsString()
    public url: string;

    @IsNotEmpty()
    @IsBoolean()
    public withPhone: boolean;
}

class RequestDto {
    pattern: "parse:update" = "parse:update";

    @ValidateNested()
    public data: RequestDataDto;
}

export class ParseUpdateResponseDto extends ParseResponseDto {
    @IsNotEmpty()
    @ValidateNested()
    public request: RequestDto;

    @IsNotEmpty()
    @IsObject()
    public data: ResponseDataDto;
}
