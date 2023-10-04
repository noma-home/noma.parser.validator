import { ParseResponseDto } from "./parse.response.dto";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { SellerDto } from "./seller.dto";
import { $Advert, $Parse } from "@types";

class RequestDataDto {
    @IsNotEmpty()
    @IsString()
    public url: string;
}

class RequestDto {
    public pattern: "parse:new" = "parse:new";

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => RequestDataDto)
    public data: RequestDataDto;
}

class ResponseAdvertDataDto {
    public data: $Advert.$Advert;
    public metadata: $Parse.$AdvertMetadata;
}

class ResponseDataDto {
    public advert: ResponseAdvertDataDto;

    @ValidateNested()
    public seller: SellerDto;
}

export class ParserNewResponseDto extends ParseResponseDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => RequestDto)
    public request: RequestDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ResponseDataDto)
    public data: ResponseDataDto;
}
