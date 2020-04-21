import {HttpModule, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ExternalSecurityRepository} from "./external-security.repository";
import {ExternalSecurityService} from "./external-security.service";
import {ExternalSecurityController} from "./external-security.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([ExternalSecurityRepository]),
    HttpModule
  ],
  controllers: [ExternalSecurityController],
  providers: [ExternalSecurityService],
  exports: [ExternalSecurityService]
})
export class ExternalSecurityModule {

}
