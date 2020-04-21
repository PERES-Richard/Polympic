import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserModule } from './user/user/user.module';
import { OrganizerGateway } from './gateway/organizer/organizer.gateway';
import { UserGateway } from './gateway/user/user.gateway';
import { ServiceApiModule } from './api/service_api/service_api.module';
import {IncidentModule} from './incident/incident.module';
import {AnonymousIncidentModule} from './api/anonymous-incident/anonymous-incident.module';
import { ExternalSecurityModule } from './api/external-security/external-security.module';
import { EventModule } from './event/event.module';
import {ExternalEventModule} from './api/external-events/external-event.module';
import {database_config, database_test_config} from './config';

let config = database_config;
if (process.env.ENV === 'dev' || process.env.ENV === 'test' ) {
    config = database_test_config;
}

@Module({
  imports: [
      TypeOrmModule.forRoot(config),
      UserModule,
      ServiceApiModule,
      EventModule,
      ExternalEventModule,
      IncidentModule,
      AnonymousIncidentModule,
      HttpModule,
      ExternalSecurityModule
  ],
  controllers: [],
  providers: [
      OrganizerGateway,
      UserGateway,
  ]
})
export class AppModule {
	constructor(private readonly connection: Connection){}
}
