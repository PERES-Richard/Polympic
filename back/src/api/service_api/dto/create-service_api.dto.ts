import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateServiceApiDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }
}
