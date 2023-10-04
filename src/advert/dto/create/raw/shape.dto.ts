import { IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { BuildingDto } from "./building.dto";
import { ItemDto } from "./item.dto";

export class ShapeDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ItemDto)
    public item: ItemDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => BuildingDto)
    public building: BuildingDto;
}
