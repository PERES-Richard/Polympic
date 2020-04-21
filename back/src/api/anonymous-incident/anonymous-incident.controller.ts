import {Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import {AnonymousIncidentService} from "./anonymous-incident.service";
import {CreateAnonymousIncidentDto} from "./dto/create-incident.dto";
import {ApiCreatedResponse} from "@nestjs/swagger";
import {User} from "../../user/user/user.entity";
import {AnonymousIncident} from "./anonymous-incident.entity";

@Controller('anonymous-incident')
export class AnonymousIncidentController {
  constructor(private readonly anonymousIncidentService: AnonymousIncidentService) {}

  /**
   * POST /anonymous-incident
   * @param body the data of the anonymous incident to add
   */
  @Post()
  @ApiCreatedResponse({
    description: 'The anonymous incident has been transmitted to specific external security services',
    type: AnonymousIncident,
  })
  async addAnonymousIncident(
    @Body(ValidationPipe) body: CreateAnonymousIncidentDto
  ){
    await this.anonymousIncidentService.addAnonymousIncident(body);
    return 'OK';
  }
}
