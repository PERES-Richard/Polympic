import { Module } from '@nestjs/common';
import { ExternalEventController } from './external-event.controller';
import { ExternalEventService } from './external-event.service';
import { ExternalEventRepository } from './external-event.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExternalEventRepository])
  ],
  controllers: [ExternalEventController],
  providers: [ExternalEventService],
  exports: [ExternalEventService],
})
export class ExternalEventModule {
}
