import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, JoinColumn } from 'typeorm';
import { User } from '../../user/user/user.entity';
import { SharedUser } from '../../user/shared_user/shared_user.entity';
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class ServiceApi extends BaseEntity{

    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    name: string;

    @Column()
    @ApiProperty()
    isExternal: boolean;

    @OneToMany(type => User, user => user.service, { onDelete: 'CASCADE' })
    users: User[];

    @OneToMany(type => SharedUser, sharedUser => sharedUser.service, { onDelete: 'CASCADE' })
    sharedUsers: User[];
}
