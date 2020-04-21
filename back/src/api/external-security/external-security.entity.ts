import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Unique} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
@Unique(["name"])
export class ExternalSecurityEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  route: string;

  @Column({ type: "float"})
  @ApiProperty()
  latitude: number;

  @Column({ type: "float"})
  @ApiProperty()
  longitude: number;

  @CreateDateColumn()
  @UpdateDateColumn()
  @ApiProperty()
  dateAdded: Date;
}
