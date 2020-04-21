import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {IncidentRepository} from "./incident.repository";
import {IncidentController} from "./incident.controller";
import {IncidentService} from "./incident.service";
import {ExternalSecurityRepository} from "../api/external-security/external-security.repository";
import {ExternalSecurityService} from "../api/external-security/external-security.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([IncidentRepository, ExternalSecurityRepository])
  ],
  controllers: [IncidentController],
  providers: [IncidentService, ExternalSecurityService],
  exports: [IncidentService]
})
export class IncidentModule {}
