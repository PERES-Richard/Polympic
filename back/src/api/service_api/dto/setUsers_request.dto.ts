import { IsNotEmpty, IsNumber, IsString, IsObject } from "class-validator";
import { CreateUserDto } from '../../../user/user/dto';
import { ApiProperty } from "@nestjs/swagger";

export class SetUsersRequestDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly service: string;

    @IsNotEmpty()
    @IsObject()
    @ApiProperty()
    readonly users: CreateUserDto[];

    constructor(service: string, users: CreateUserDto[]) {
        this.service = service;
        this.users = users;
    }
}