import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { CategoryEnum, OperationEnum } from "@advert";

export class ParseLatestRequest {
    @IsNotEmpty()
    @IsString()
    public parser: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(CategoryEnum)
    public category: CategoryEnum;

    @IsNotEmpty()
    @IsString()
    @IsEnum(OperationEnum)
    public operation: OperationEnum;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    public limit: number;
}
