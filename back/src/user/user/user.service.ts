import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto, RangeDto } from './dto';
import {DeleteResult} from "typeorm";
import {OrganizerGateway} from "../../gateway/organizer/organizer.gateway";
import {ServiceApiService} from "../../api/service_api/service_api.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private organizerGateway: OrganizerGateway,
        private serviceApiService: ServiceApiService
    ) {}

        private sseServers = [];

    async addSseConnection(server){
        this.sseServers.push(server);
    }

    async removeSseConnection(server){
        this.sseServers.splice(this.sseServers.indexOf(server), 1);
    }

    async notifyAllSseServers(user) {
        this.sseServers.forEach((server) => {
            server.write('data:' + JSON.stringify(user) + '\n\n');
        });
    }

    async addUserPosition(body: CreateUserDto, addTransmission: boolean): Promise<User> {
        let user = await this.userRepository.findOne({uuid: body.uuid});

        if (user !== undefined) {
            user = await this.userRepository.updateUser(user, body);
        } else {
            user = await this.userRepository.createUser(body);
        }

        if (addTransmission) {
            this.notifyAllSseServers(user);
            this.serviceApiService.sendCoordinatesToService(user);
        }

        return user;
    }

    async deleteUserPosition(uuid: string): Promise<DeleteResult> {
        return this.userRepository.deleteUser(uuid);
    }

    async getUsersInRange(latitude: number, longitude: number, range: number): Promise<User[]> {
        try {
            return await this.userRepository.getUsersInRange(latitude, longitude, range);
        } catch (err) {
            throw new InternalServerErrorException();
        }
    }

    async getNumberOfUserInRange(latitude: number, longitude: number, range: number): Promise<number> {
        try {
            return await this.userRepository.getNumberOfUserInRange(latitude, longitude, range);
        } catch (err) {
            throw new InternalServerErrorException();
        }
    }

    async getRecentUsers(): Promise<User[]> {
        try {
            return await this.userRepository.getRecentUsers();
        } catch(err) {
            throw new InternalServerErrorException();
        }

    }

    async getRecentExternalUsers(): Promise<User[]> {
        try {
            return await this.userRepository.getRecentExternalUsers();
        } catch(err) {
            throw new InternalServerErrorException();
        }
    }
}
