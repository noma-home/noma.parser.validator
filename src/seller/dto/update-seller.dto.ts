import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateSellerDto {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    public id: string;

    @IsOptional()
    @IsBoolean()
    public isRealtor: boolean;

    @IsOptional()
    @IsBoolean()
    public isApprovedSeller: boolean;
}
