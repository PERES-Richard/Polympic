import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import { User } from "../user/user/user.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class EventEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    title: string;

    @Column()
    @ApiProperty()
    description: string;

    @Column({ type: "float" })
    @ApiProperty()
    latitude: number;

    @Column({ type: "float" })
    @ApiProperty()
    longitude: number;

    @Column()
    @ApiProperty()
    startDate: Date;

    @Column()
    @ApiProperty()
    endDate: Date;

    @Column({default: false})
    @ApiProperty()
    isCancelled: boolean;

    @ManyToMany(type => User, user => user.events)
    @JoinTable()
    users: User[];
}
