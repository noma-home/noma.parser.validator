import { IsNotEmpty, IsString } from "class-validator";

export class AnagraphDto {
    @IsNotEmpty()
    @IsString()
    public title: string;

    @IsNotEmpty()
    @IsString()
    public description: string;
}
