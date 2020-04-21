import { EntityRepository, Repository } from "typeorm";
import {InternalServerErrorException} from "@nestjs/common";
import {CreateAnonymousIncidentDto } from "./dto/create-incident.dto";
import {AnonymousIncident} from "./anonymous-incident.entity";

/**
 * This repository is used to manage anonymous incident table
 */
@EntityRepository(AnonymousIncident)
export class AnonymousIncidentRepository extends Repository<AnonymousIncident> {
    /**
    * Add a new anonymous incident in the table
    * @param createAnonymousIncidentDto the anonymous incident dto to add in the table
    */
    async createAnonymousIncident(createAnonymousIncidentDto: CreateAnonymousIncidentDto): Promise<AnonymousIncident> {
        const incident = new AnonymousIncident();
        incident.latitude = createAnonymousIncidentDto.latitude;
        incident.longitude = createAnonymousIncidentDto.longitude;

        try {
            await incident.save();
        } catch (error) {
            throw new InternalServerErrorException();
        }
        return incident;
    }
}
