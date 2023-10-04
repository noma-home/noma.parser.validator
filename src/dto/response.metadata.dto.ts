import { IsDate, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class Time {
    @IsNotEmpty()
    @IsDate()
    public start: Date;

    @IsNotEmpty()
    @IsDate()
    public finish: Date;
}

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
    @ValidateNested()
    @Type(() => Time)
    public time: Time;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Parser)
    public parser: Parser;
}
