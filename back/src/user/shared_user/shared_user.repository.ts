import { EntityRepository, Repository } from 'typeorm';
import { SharedUser } from './shared_user.entity';

/**
* this class is used to interact with database and shared user table
*/

@EntityRepository(SharedUser)
export class SharedUserRepository extends Repository<SharedUser> {

}
