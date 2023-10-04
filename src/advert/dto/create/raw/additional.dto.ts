import { IsBoolean, IsNumber, IsOptional, Min } from "class-validator";

export class AdditionalDto {
    @IsOptional()
    @IsBoolean()
    public balcony: boolean;

    @IsOptional()
    @IsBoolean()
    public terrace: boolean;

    @IsOptional()
    @IsBoolean()
    public loggia: boolean;

    @IsOptional()
    @IsNumber()
    @Min(0)
    public totalNumber: number;
}
