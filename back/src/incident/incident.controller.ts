import {Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import {IncidentService} from "./incident.service";
import {CreateIncidentDto} from "./dto/create-incident.dto";
import {ApiCreatedResponse} from "@nestjs/swagger";
import {User} from "../user/user/user.entity";
import {Incident} from "./incident.entity";

@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  /**
   * POST /incident
   * @param body the data to create a new incident
   */
  @Post()
  @ApiCreatedResponse({
    description: 'The incident has been successfully transmitted',
    type: 'OK',
  })
  async addIncident(
    @Body(ValidationPipe) body: CreateIncidentDto
  ){
    await this.incidentService.addUserIncident(body);
    return JSON.stringify("OK");
  }
}
