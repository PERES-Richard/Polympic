import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RangeDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    readonly range: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    readonly latitude: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    readonly longitude: number;
}
