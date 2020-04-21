import {Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {AnonymousIncident} from "./anonymous-incident.entity";
import {CreateAnonymousIncidentDto} from "./dto/create-incident.dto";
import {AnonymousIncidentRepository} from "./anonymous-incident.repository";
import {ExternalSecurityService} from "../external-security/external-security.service";

@Injectable()
export class AnonymousIncidentService {
  constructor(
    @InjectRepository(AnonymousIncidentRepository)
    private incidentRepository: AnonymousIncidentRepository,
    private externalSecurityService: ExternalSecurityService
  ) {}

  async addAnonymousIncident(body: CreateAnonymousIncidentDto): Promise<AnonymousIncident> {
    let res = this.incidentRepository.createAnonymousIncident(body);
    this.externalSecurityService.sendAnonymousIncidentToSecurity(await res);
    return res;
  }
}
