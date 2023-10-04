import { IsBoolean, IsNumber, IsOptional, Min } from "class-validator";

export class FloorDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    public numberOfFloors: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    public itemFloor: number;

    @IsOptional()
    @IsBoolean()
    public isZeroLevelFloor: boolean;
}
