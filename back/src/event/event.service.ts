import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from './event.repository';
import { EventEntity } from './event.entity';
import { CreateEventDto } from './dto';
import {DeleteResult } from 'typeorm';
import {ExternalEventService} from "../api/external-events/external-event.service";

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(EventRepository)
        private eventRepository: EventRepository,
        private externalEventService: ExternalEventService,
    ) {}

        private sseServers = [];

    async addSseConnection(server) {
        this.sseServers.push(server);
    }

    async removeSseConnection(server) {
        this.sseServers.splice(this.sseServers.indexOf(server), 1);
    }

    async notifyAllSseServers(event) {
        this.sseServers.forEach((server) => {
            server.write('data:' + JSON.stringify(event) + '\n\n');
        });
    }

    async getEvents() {
        return await this.eventRepository.getEvents();
    }

    async searchEvents(searchText: string) {
        let events = [];
        events = events.concat(await this.eventRepository.getMatchingEvents(searchText));
        events = events.concat(await this.externalEventService.searchEvents(searchText));
        return events;
    }

    async addEventPosition(body: CreateEventDto, addTransmission: boolean): Promise<EventEntity> {
        const event = await this.eventRepository.createEvent(body);

        if (addTransmission) {
            this.notifyAllSseServers(event);
        }

        return event;
    }

    async deleteEvent(id: number): Promise<DeleteResult> {
        return this.eventRepository.deleteEvent(id);
    }

    async updateEvent(id: number, event: CreateEventDto): Promise<EventEntity> {
        await this.eventRepository.updateEvent(id, event);
        const eventFound = await this.eventRepository.findOne({id});
        this.notifyAllSseServers(eventFound);
        return eventFound;
    }
}
