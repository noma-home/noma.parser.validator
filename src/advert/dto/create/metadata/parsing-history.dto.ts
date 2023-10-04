import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class ParsingHistoryDto {
    @IsNotEmpty()
    @IsString()
    public resource: string;

    @IsNotEmpty()
    @IsDate()
    public date: Date;
}
