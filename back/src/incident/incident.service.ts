import {Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {IncidentRepository} from "./incident.repository";
import {CreateIncidentDto} from "./dto/create-incident.dto";
import {Incident} from "./incident.entity";
import {ExternalSecurityService} from "../api/external-security/external-security.service";

/**
 * this service use incident repository and external security service to manage incidents
 */

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(IncidentRepository)
    private incidentRepository: IncidentRepository,
    private externalSecurityService: ExternalSecurityService
  ) {}

  /**
   * When an incident is created, we can send it to the security
   * @param body
   */
  async addUserIncident(body: CreateIncidentDto): Promise<Incident> {
    let res = await this.incidentRepository.createUserIncident(body);
    this.externalSecurityService.sendIncidentToSecurity(res);
    return res;
  }
}
