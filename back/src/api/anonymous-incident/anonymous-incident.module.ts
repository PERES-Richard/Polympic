import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AnonymousIncidentRepository} from "./anonymous-incident.repository";
import {AnonymousIncidentService} from "./anonymous-incident.service";
import { AnonymousIncidentController } from './anonymous-incident.controller';
import {ExternalSecurityRepository} from "../external-security/external-security.repository";
import {ExternalSecurityService} from "../external-security/external-security.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([AnonymousIncidentRepository, ExternalSecurityRepository])
  ],
  controllers: [AnonymousIncidentController],
  providers: [AnonymousIncidentService, ExternalSecurityService],
  exports: [AnonymousIncidentService]
})
export class AnonymousIncidentModule {}
