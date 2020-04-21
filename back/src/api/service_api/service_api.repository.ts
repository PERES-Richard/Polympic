import { EntityRepository, Repository } from "typeorm";
import { ServiceApi } from "./service_api.entity";

/**
 * the repository is used to contact database and get information about shared users
 */
@EntityRepository(ServiceApi)
export class ServiceApiRepository extends Repository<ServiceApi> { }
