import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedUserRepository } from '../shared_user/shared_user.repository';
import {OrganizerGateway} from '../../gateway/organizer/organizer.gateway';
import {ServiceApiModule} from '../../api/service_api/service_api.module';
import { UserMiddleware } from './user.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, SharedUserRepository]),
    ServiceApiModule,
  ],
  controllers: [UserController],
  providers: [UserService, OrganizerGateway], // TODO : socket open twice
  exports: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('user/init_sse_connection');
  }
}
