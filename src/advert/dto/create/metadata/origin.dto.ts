import { IsDate, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class OriginDto {
    @IsNotEmpty()
    @IsString()
    public resource: string;

    @IsNotEmpty()
    @IsString()
    @IsUrl()
    public url: string;

    @IsOptional()
    @IsString()
    public id?: string;

    @IsNotEmpty()
    @IsDate()
    public created: Date;

    @IsNotEmpty()
    @IsDate()
    public lastUpdate: Date;

    @IsOptional()
    @IsDate()
    public lastPhoneUpdate: Date;
}
