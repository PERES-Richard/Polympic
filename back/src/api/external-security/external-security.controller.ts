import {Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import {CreateExternalSecurityDto} from "./dto/create-external-security.dto";
import {ExternalSecurityService} from "./external-security.service";
import {ApiCreatedResponse} from "@nestjs/swagger";
import {User} from "../../user/user/user.entity";
import {ExternalSecurityEntity} from "./external-security.entity";

@Controller('external-security')
export class ExternalSecurityController {
  constructor(private readonly externalSecurityService: ExternalSecurityService) {}

  /**
   * POST external-security
   * @param body the data for creating a new external security service
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
