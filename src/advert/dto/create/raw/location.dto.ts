import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LocationDto {
    @IsNotEmpty()
    @IsString()
    public region: string;

    @IsNotEmpty()
    @IsString()
    public settlement: string;

    @IsOptional()
    @IsString()
    public street: string;

    @IsOptional()
    @IsString()
    public district: string;

    @IsOptional()
    @IsString()
    public neighborhood: string;

    @IsOptional()
    @IsString()
    public subRegion: string;

    @IsOptional()
    @IsString()
    public itemNumber: string;
}
