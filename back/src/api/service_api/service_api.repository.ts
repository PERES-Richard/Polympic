import { EntityRepository, Repository } from "typeorm";
import { ServiceApi } from "./service_api.entity";

@EntityRepository(ServiceApi)
export class ServiceApiRepository extends Repository<ServiceApi> { }