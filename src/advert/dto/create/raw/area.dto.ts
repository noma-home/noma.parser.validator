import { IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class AreaDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(0.1)
    public total: number;

    @IsOptional()
    @IsNumber()
    @Min(0.1)
    public kitchen?: number;

    @IsOptional()
    @IsNumber()
    @Min(0.1)
    public living?: number;
}
