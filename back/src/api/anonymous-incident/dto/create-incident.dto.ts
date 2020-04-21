import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateAnonymousIncidentDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly latitude: number;

  @IsNotEmpty()
  @ApiProperty()
  readonly longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
