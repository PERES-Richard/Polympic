import { BaseEntity, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Entity } from "typeorm";
import { ServiceApi } from "../../api/service_api/service_api.entity";

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
