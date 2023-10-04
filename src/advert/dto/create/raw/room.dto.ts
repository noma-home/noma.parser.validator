import { IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class RoomDto {
    @IsNotEmpty({ message: "Необхідно вказати кількість кімнат" })
    @IsNumber(undefined, { message: () => "" })
    @Min(0, { message: () => "" })
    public totalNumber: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    public numberOfSeparated: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    public roomHeight: number;
}
