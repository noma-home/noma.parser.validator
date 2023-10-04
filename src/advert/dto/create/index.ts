import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

import { DataDto } from "./data.dto";
import { MetadataDto } from "./metadata";

export class CreateAdvertDto {
    @Type(() => DataDto)
    @ValidateNested()
    public data: DataDto;

    @Type(() => MetadataDto)
    @ValidateNested()
    public metadata: MetadataDto;
}
