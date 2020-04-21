import { EntityRepository, Repository } from "typeorm";
import {InternalServerErrorException} from "@nestjs/common";
import {ExternalSecurityEntity} from "./external-security.entity";
import {CreateExternalSecurityDto} from "./dto/create-external-security.dto";

@EntityRepository(ExternalSecurityEntity)
export class ExternalSecurityRepository extends Repository<ExternalSecurityEntity> {
    async createOrUpdateExternalSecurity(createSecurityDto: CreateExternalSecurityDto, security: ExternalSecurityEntity): Promise<ExternalSecurityEntity> {
        if (security === null) {
            security = new ExternalSecurityEntity();
        }
        security.latitude = createSecurityDto.latitude;
        security.longitude = createSecurityDto.longitude;
        security.route = createSecurityDto.route;
        security.name = createSecurityDto.name;

        try {
            await security.save();
        } catch (error) {
            throw new InternalServerErrorException();
        }
        return security;
    }
}
