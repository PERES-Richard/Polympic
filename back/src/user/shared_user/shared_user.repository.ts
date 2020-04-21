import { EntityRepository, Repository } from "typeorm";
import { SharedUser } from './shared_user.entity';

@EntityRepository(SharedUser)
export class SharedUserRepository extends Repository<SharedUser> {

}