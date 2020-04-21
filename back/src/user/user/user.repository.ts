import {DeleteResult, EntityRepository, Repository} from "typeorm";

import { User } from "./user.entity";
import { CreateUserDto, RangeDto } from "./dto";
import { InternalServerErrorException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.latitude = createUserDto.latitude;
        user.longitude = createUserDto.longitude;
        user.uuid = createUserDto.uuid;

        try {
            await user.save();
        } catch (error) {
            throw new InternalServerErrorException();
        }
        return user;
    }

    async deleteUser(uuid: string): Promise<DeleteResult>{
        try {
            return await this.delete({uuid});
        } catch (err) {
            console.log(new InternalServerErrorException(err));
        }
    }

    async updateUser(user: User, createUserDto: CreateUserDto): Promise<User> {
        user.latitude = createUserDto.latitude;
        user.longitude = createUserDto.longitude;
        user.uuid = createUserDto.uuid;

        try {
            await user.save();
        } catch (error) {
            throw new InternalServerErrorException();
        }
        return user;
    }

    async getUsersInRange(latitude: number, longitude: number, range: number): Promise<User[]> {
        return this.createQueryBuilder("user")
        .where('user.latitude <= :latitude1', { latitude1: (Number(latitude) + Number(range)) })
        .andWhere('user.latitude >= :latitude2', { latitude2: (Number(latitude) - Number(range)) })
        .andWhere('user.longitude <= :longitude1', { longitude1: (Number(longitude) + Number(range)) })
        .andWhere('user.longitude >= :longitude2', { longitude2: (Number(longitude) - Number(range)) })
        .getMany();
    }

    async getNumberOfUserInRange(latitude: number, longitude: number, range: number): Promise<number> {
        return this.createQueryBuilder("user")
        .where('user.latitude <= :latitude1', { latitude1: (Number(latitude) + Number(range)) })
        .andWhere('user.latitude >= :latitude2', { latitude2: (Number(latitude) - Number(range)) })
        .andWhere('user.longitude <= :longitude1', { longitude1: (Number(longitude) + Number(range)) })
        .andWhere('user.longitude >= :longitude2', { longitude2: (Number(longitude) - Number(range)) })
        .getCount();
    }

    getRecentUsers(): Promise<User[]> {
        let recentDate = new Date();
        recentDate.setMinutes(recentDate.getMinutes() - 5);
        return this.createQueryBuilder("user")
            .leftJoinAndSelect("user.service", "service")
            .where("user.date > :recentDate", { recentDate })
            .andWhere("user.service is NULL")
            .getMany();
    }

    getRecentExternalUsers(): Promise<User[]> {
        let recentDate = new Date();
        recentDate.setMinutes(recentDate.getMinutes() - 5);
        return this.createQueryBuilder("user")
            .leftJoinAndSelect("user.service", "service")
            .where("user.date > :recentDate", { recentDate })
            .andWhere("user.service is not NULL")
            .getMany();
    }
}
