import { Module, HttpModule } from '@nestjs/common';
import { ServiceApiController } from './service_api.controller';
import { ServiceApiService } from './service_api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceApiRepository } from './service_api.repository';
import { UserRepository } from '../../user/user/user.repository';
import { SharedUserRepository } from '../../user/shared_user/shared_user.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([ServiceApiRepository, UserRepository, SharedUserRepository]),
        HttpModule
    ],
    controllers: [ServiceApiController],
    providers: [ServiceApiService],
    exports: [ServiceApiService]
})
export class ServiceApiModule { }
