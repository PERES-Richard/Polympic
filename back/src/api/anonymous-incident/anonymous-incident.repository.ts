import { EntityRepository, Repository } from "typeorm";
import {InternalServerErrorException} from "@nestjs/common";
import {CreateAnonymousIncidentDto } from "./dto/create-incident.dto";
import {AnonymousIncident} from "./anonymous-incident.entity";

@EntityRepository(AnonymousIncident)
export class AnonymousIncidentRepository extends Repository<AnonymousIncident> {
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
