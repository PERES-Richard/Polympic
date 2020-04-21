import { Injectable, InternalServerErrorException, HttpException, HttpStatus, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceApiRepository } from './service_api.repository';
import { ServiceApi } from './service_api.entity';
import { UserRepository } from '../../user/user/user.repository';
import { CreateUserDto } from '../../user/user/dto';
import { SharedUserRepository } from '../../user/shared_user/shared_user.repository';
import { UserFacade } from '../../gateway/user/user.facade';

@Injectable()
export class ServiceApiService {
    constructor(
        @InjectRepository(ServiceApiRepository)
        private serviceApiRepository: ServiceApiRepository,
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(SharedUserRepository)
        private sharedUserRepository: SharedUserRepository
    ) { }

    private readonly httpService: HttpService = new HttpService;

    async setUsers(serviceName: string, users: CreateUserDto[]) {
        let service = await this.getOrAddService(serviceName);
        let tempUsersToAdd = users.map(v => ({ ...v, service: service }));
        let tempMap = [];
        let usersToAdd = [];
        tempUsersToAdd.forEach((elem) => {
            if(!tempMap.hasOwnProperty(elem.uuid)){
                tempMap[elem.uuid] = elem;
                usersToAdd.push(elem);
            }
        });
        let addedUsers = [];
        try {
            addedUsers = await this.userRepository.save(usersToAdd);
        } catch (e) {
            throw new InternalServerErrorException("An error occured when updating users location in database.");
        }
        addedUsers.forEach((elem) => {
            delete elem.service;
        })
        return addedUsers;
    }

    async addSharedUser(serviceName: string, userUuid: string, duration: number, address: string){
        let MAX_DURATION = 30;
        if(duration > MAX_DURATION){
            duration = MAX_DURATION;
        }
        let service = await this.getOrAddService(serviceName);
        let user = await this.userRepository.findOne({ uuid: userUuid });
        if(!user){
            throw new HttpException("Given UUID doesn't exist", HttpStatus.BAD_REQUEST);
        }
        let date = new Date(Date.now() + duration*60000);
        let userToAdd = { uuid: user.uuid, service: service, endOfSharing: date, address: address };
        try{
            await this.sharedUserRepository.save(userToAdd);
        } catch(e){
            throw new InternalServerErrorException("An error occured when adding the shared user to database : ", e);
        }
        return user;
    }

    async sendCoordinatesToService(user: UserFacade){
        let sharedUser = await this.sharedUserRepository.findOne({uuid: user.uuid});
        if(!sharedUser){
            return;
        } else {
            if(sharedUser.endOfSharing.getTime() < Date.now()){
                this.sharedUserRepository.createQueryBuilder('shared_user')
                    .delete().where('shared_user.uuid = :uuid', {uuid: user.uuid});
                return;
            }
        }
        let result = {uuid: sharedUser.uuid, latitude: user.latitude, longitude: user.longitude};
        this.httpService.post("http://" + sharedUser.address + "/polympic/user_position", result).subscribe(x => {
            console.debug(x);
        }, (error => {
            console.debug("URL has a problem");
        }));;

    }

    async getOrAddService(serviceName: string): Promise<ServiceApi> {
        let query = this.serviceApiRepository
            .createQueryBuilder('service_api')
            .where('service_api.name = :serviceName', { serviceName });
        let service: ServiceApi;
        try {
            service = await query.getOne();
        } catch (e) {
            throw new InternalServerErrorException("Couldn't get service in database.");
        }
        if (!service) {
            let newService = new ServiceApi();
            newService.name = serviceName;
            newService.isExternal = true;
            let savedService: ServiceApi;
            try {
                savedService = await this.serviceApiRepository.save(newService);
            } catch (e) {
                throw new InternalServerErrorException("An error occured when adding service to the database.");
            }
            if (!savedService) {
                throw new InternalServerErrorException("Service haven't been added.");
            } else {
                service = savedService;
            }
        }
        return service;
    }

}
