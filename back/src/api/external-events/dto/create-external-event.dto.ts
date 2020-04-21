import {IsNotEmpty, IsString, IsDate, IsNumber} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateExternalEventDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly provider: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly description: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    readonly latitude: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    readonly longitude: number;

    @IsNotEmpty()
    @IsDate()
    @ApiProperty()
    readonly startDate: Date;

    @IsNotEmpty()
    @IsDate()
    @ApiProperty()
    readonly endDate: Date;

    constructor(title: string, provider: string, description: string, latitude: number, longitude: number, startDate: Date, endDate: Date) {
        this.title = title;
        this.provider = provider;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
