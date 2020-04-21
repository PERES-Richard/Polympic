import {
    BaseEntity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Incident extends BaseEntity {

    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
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
}
