import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateExternalSecurityDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly longitude: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly route: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  constructor(latitude: number, longitude: number, route: string, name: string) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.route = route;
    this.name = name;
  }
}
