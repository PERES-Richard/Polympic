import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly uuid: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    readonly latitude: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    readonly longitude: number;

    constructor(uuid: string, latitude: number, longitude: number) {
        this.uuid = uuid;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
