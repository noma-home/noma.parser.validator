import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SellerDto {
    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsNotEmpty()
    @IsString({ each: true })
    @IsArray()
    public phones: string[];

    @IsOptional()
    @IsString()
    public url?: string;
}
