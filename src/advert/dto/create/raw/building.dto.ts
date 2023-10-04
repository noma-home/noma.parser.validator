import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min } from "class-validator";
import { BuildingEnum, WallEnum } from "@advert";

export class BuildingDto {
    @IsOptional()
    @IsEnum(BuildingEnum)
    public buildingType: string;

    @IsNotEmpty({ message: "Необхідно вказати тип стін" })
    @IsEnum(WallEnum, { message: () => "" })
    public wall: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    public numberOfFloors: number;

    @IsOptional()
    @IsString()
    @Matches(new RegExp(/^(19|20)\d{2}$/))
    public year: string;

    @IsOptional()
    @IsBoolean()
    public elevator: boolean;
}
