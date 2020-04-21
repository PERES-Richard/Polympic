import { IsNotEmpty, IsNumber, IsString, IsObject } from "class-validator";
import { CreateUserDto } from '../../../user/user/dto';
import { ApiProperty } from "@nestjs/swagger";

export class RequestUserPositionDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly service: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly uuid: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    readonly duration: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly address: string;

    constructor(service: string, uuid: string, duration: number, address: string) {
        this.service = service;
        this.uuid = uuid;
        this.duration = duration;
        this.address = address;
    }
}