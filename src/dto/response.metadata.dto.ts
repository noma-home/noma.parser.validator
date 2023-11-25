import { IsDate, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class Time {}

class Parser {
    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsNotEmpty()
    @IsString()
    public queue: string;
}

export class ResponseMetadataDto {
    @IsNotEmpty()
    @IsDate()
    public start: Date;

    @IsNotEmpty()
    @IsDate()
    public finish: Date;
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Parser)
    public parser: Parser;
}
