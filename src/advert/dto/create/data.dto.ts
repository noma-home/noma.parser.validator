import { IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { RawDto } from "./raw";

export class DataDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => RawDto)
    raw: RawDto;
}
