import { BaseEntity, Column, ManyToOne, PrimaryColumn, Entity } from 'typeorm';
import { ServiceApi } from '../../api/service_api/service_api.entity';

/**
 * a shared user is a user got from external services
 */

@Entity()
export class SharedUser extends BaseEntity {

    @PrimaryColumn()
    uuid: string;
    
    @ManyToOne(type => ServiceApi, serviceApi => serviceApi.users)
    service: ServiceApi;

    @Column()
    address: string;

    @Column()
    endOfSharing: Date;
}
