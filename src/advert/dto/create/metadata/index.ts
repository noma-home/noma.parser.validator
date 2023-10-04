import { IsNotEmpty, IsObject, ValidateNested } from "class-validator";

import { ParsingHistoryDto } from "./parsing-history.dto";
import { OriginDto } from "./origin.dto";

export class MetadataDto {
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    public origins: Record<string, OriginDto>;

    @ValidateNested()
    public parsingHistory: ParsingHistoryDto[];
}
