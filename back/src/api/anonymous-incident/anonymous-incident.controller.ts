import {Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import {AnonymousIncidentService} from "./anonymous-incident.service";
import {CreateAnonymousIncidentDto} from "./dto/create-incident.dto";
import {ApiCreatedResponse} from '@nestjs/swagger';
import {AnonymousIncident} from "./anonymous-incident.entity";

/**
 * This class is used for the api to report anonymous incident. Anonymous incident are reported thanks to this api so incident is not linked to any Polympic user
 */
@Controller('anonymous-incident')
export class AnonymousIncidentController {
  constructor(private readonly anonymousIncidentService: AnonymousIncidentService) {}

  /**
   * POST /anonymous-incident to add a new anonymous incident
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
