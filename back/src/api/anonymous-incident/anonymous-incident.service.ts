import {Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {AnonymousIncident} from "./anonymous-incident.entity";
import {CreateAnonymousIncidentDto} from "./dto/create-incident.dto";
import {AnonymousIncidentRepository} from "./anonymous-incident.repository";
import {ExternalSecurityService} from "../external-security/external-security.service";

/**
 * This service is used to access anonymous incident repository in order to manage incidents in tables
 */
@Injectable()
export class AnonymousIncidentService {
  constructor(
    @InjectRepository(AnonymousIncidentRepository)
    private incidentRepository: AnonymousIncidentRepository,
    private externalSecurityService: ExternalSecurityService
  ) {}

  /**
   * contact the repository to add a new anonymous incident
   * @param body
   */
  async addAnonymousIncident(body: CreateAnonymousIncidentDto): Promise<AnonymousIncident> {
    let res = this.incidentRepository.createAnonymousIncident(body);
    this.externalSecurityService.sendAnonymousIncidentToSecurity(await res);
    return res;
  }
}
