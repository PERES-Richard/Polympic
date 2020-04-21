import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import { User } from "../../user/user/user.entity";

@Entity()
export class ExternalEventEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    provider: string;

    @Column()
    description: string;

    @Column({ type: "float" })
    latitude: number;

    @Column({ type: "float" })
    longitude: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({default: false})
    isCancelled: boolean;

    @ManyToMany(type => User, user => user.events)
    @JoinTable()
    users: User[];
}
