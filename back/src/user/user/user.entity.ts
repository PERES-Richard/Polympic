import { BaseEntity, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Entity, ManyToMany} from 'typeorm';
import { ServiceApi } from '../../api/service_api/service_api.entity';
import { EventEntity } from '../../event/event.entity';
import {ApiProperty} from '@nestjs/swagger';

@Entity()
export class User extends BaseEntity {

    @PrimaryColumn()
    @ApiProperty()
    uuid: string;

    @Column({ type: "float"})
    @ApiProperty()
    latitude: number;

    @Column({ type: "float"})
    @ApiProperty()
    longitude: number;

    @CreateDateColumn()
    @UpdateDateColumn()
    @ApiProperty()
    date: Date;

    @ManyToOne(type => ServiceApi, serviceApi => serviceApi.users)
    service: ServiceApi;

    @ManyToMany(type => EventEntity, event => event.users)
    events: Event[];
}
