import { EntityRepository, Repository } from "typeorm";
import {InternalServerErrorException} from "@nestjs/common";
import {CreateIncidentDto} from "./dto/create-incident.dto";
import {Incident} from "./incident.entity";

@EntityRepository(Incident)
export class IncidentRepository extends Repository<Incident> {
    async createUserIncident(createIncidentDto: CreateIncidentDto): Promise<Incident> {
        const incident = new Incident();
        incident.latitude = createIncidentDto.latitude;
        incident.longitude = createIncidentDto.longitude;
        incident.uuid = createIncidentDto.uuid;

        try {
            await incident.save();
        } catch (error) {
            throw new InternalServerErrorException();
        }
        return incident;
    }
}
