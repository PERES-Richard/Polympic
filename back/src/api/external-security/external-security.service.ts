import {HttpService, Injectable, InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {ExternalSecurityRepository} from "./external-security.repository";
import {CreateExternalSecurityDto} from "./dto/create-external-security.dto";
import {ExternalSecurityEntity} from "./external-security.entity";
import {AnonymousIncident} from "../anonymous-incident/anonymous-incident.entity";
import {Incident} from "../../incident/incident.entity";

@Injectable()
export class ExternalSecurityService {
  constructor(
    @InjectRepository(ExternalSecurityRepository)
    private externalSecurityRepository: ExternalSecurityRepository
  ) {}

  private readonly httpService: HttpService = new HttpService;

  /**
   * used by the controller to register a new external security service
   * @param body the data for creating the external security service
   */
  async addExternalSecurity(body: CreateExternalSecurityDto): Promise<ExternalSecurityEntity> {
    const apiFound = await this.externalSecurityRepository.findOne({name: body.name});
    if (apiFound !== undefined) {
      return this.externalSecurityRepository.createOrUpdateExternalSecurity(body, apiFound);
    } else {
      return this.externalSecurityRepository.createOrUpdateExternalSecurity(body, null);
    }
  }

  /**
   * send an anonymous incident to every security service
   * @param incident the incident to send
   */
  sendAnonymousIncidentToSecurity(incident: AnonymousIncident): void{
    this.externalSecurityRepository.find().then(authorities => {
      for(let i=0;i<authorities.length;i++){
        console.log(authorities[i].route);
        this.httpService.post(authorities[i].route, incident).subscribe(x => {
          //console.debug(x);
        }, (error => {
          //console.log(error);
          //console.debug("URL has a problem");
        }));
      }
    }).catch(err => {
      console.log(new InternalServerErrorException(err));
    });
  }

  /**
   * send an incident to every security service
   * @param incident the incident to send
   */
  sendIncidentToSecurity(incident: Incident): void{
    this.externalSecurityRepository.find().then(authorities => {
      for(let i=0;i<authorities.length;i++){
        this.httpService.post(authorities[i].route, incident).subscribe(x => {
          console.debug(x);
        }, (error => {
          console.debug("URL has a problem");
        }));
      }
    });
  }

}
