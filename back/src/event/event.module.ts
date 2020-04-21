import { Module, MiddlewareConsumer } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventMiddleware } from './event.middleware';
import {ExternalEventModule} from "../api/external-events/external-event.module";

@Module({
  imports: [
      ExternalEventModule,
      TypeOrmModule.forFeature([EventRepository]),
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(EventMiddleware).forRoutes('event/init_sse_connection');
  }
}
