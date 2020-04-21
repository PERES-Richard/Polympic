import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateIncidentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly uuid: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly latitude: number;

  @IsNotEmpty()
  @ApiProperty()
  readonly longitude: number;

  constructor(uuid: string, latitude: number, longitude: number) {
    this.uuid = uuid;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
