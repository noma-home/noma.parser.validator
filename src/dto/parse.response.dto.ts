import { IsNotEmpty, ValidateNested } from "class-validator";
import { ResponseMetadataDto } from "./response.metadata.dto";
import { Type } from "class-transformer";

export class ParseResponseDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ResponseMetadataDto)
    public metadata: ResponseMetadataDto;
}
