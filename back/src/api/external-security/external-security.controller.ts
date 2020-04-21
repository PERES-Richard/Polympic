import {Body, Controller, Post} from '@nestjs/common';
import {CreateExternalSecurityDto} from "./dto/create-external-security.dto";
import {ExternalSecurityService} from "./external-security.service";
import {ApiCreatedResponse} from "@nestjs/swagger";
import {ExternalSecurityEntity} from "./external-security.entity";

/**
 * This class is used for the api to add new external security entity. The security entity will be notified when an incident is reported
 */
@Controller('external-security')
export class ExternalSecurityController {
  constructor(private readonly externalSecurityService: ExternalSecurityService) {}

  /**
   * POST external-security used to ann new external security entity
   * @param body the data for creating a new external security entity
   */
  @Post()
  @ApiCreatedResponse({
    description: 'The external security service has been created',
    type: ExternalSecurityEntity,
  })
  async addExternalSecurity(
    @Body() body: CreateExternalSecurityDto
  ){
    return this.externalSecurityService.addExternalSecurity(body);
  }
}
