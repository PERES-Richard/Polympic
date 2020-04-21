import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternalEventRepository } from './external-event.repository';
import { ExternalEventEntity } from './external-event.entity';
import { CreateExternalEventDto } from './dto';
import {DeleteResult} from 'typeorm';

@Injectable()
export class ExternalEventService {
    constructor(
        @InjectRepository(ExternalEventRepository)
        private eventRepository: ExternalEventRepository,
    ) {}

    async getEvents() {
        return this.eventRepository.getEvents();
    }

    async searchEvents(searchText: string) {
        return await this.eventRepository.getMatchingEvents(searchText);
    }

    async addEventPosition(body: CreateExternalEventDto): Promise<ExternalEventEntity> {
        return await this.eventRepository.createEvent(body);
    }

    async deleteEvent(id: number): Promise<DeleteResult> {
        return this.eventRepository.deleteEvent(id);
    }

    async updateEvent(id: number, event: CreateExternalEventDto): Promise<ExternalEventEntity> {
        await this.eventRepository.updateEvent(id, event);
        return await this.eventRepository.findOne({id});
    }
}
