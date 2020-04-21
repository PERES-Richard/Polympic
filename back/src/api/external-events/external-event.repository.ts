import {DeleteResult, EntityRepository, Repository, UpdateResult} from "typeorm";

import {ExternalEventEntity} from "./external-event.entity";
import {InternalServerErrorException} from "@nestjs/common";
import {CreateExternalEventDto} from "./dto";

@EntityRepository(ExternalEventEntity)
export class ExternalEventRepository extends Repository<ExternalEventEntity> {

    async getEvents(): Promise<ExternalEventEntity[]>{
        return this.find({isCancelled: false});
    }

    async createEvent(createEventDto: CreateExternalEventDto): Promise<ExternalEventEntity> {
        const event = new ExternalEventEntity();

        event.title = createEventDto.title;
        event.provider = createEventDto.provider;
        event.description = createEventDto.description;
        event.latitude = createEventDto.latitude;
        event.longitude = createEventDto.longitude;
        event.startDate = createEventDto.startDate;
        event.endDate = createEventDto.endDate;

        try {
            await event.save();
        } catch (error) {
            throw new InternalServerErrorException("Error : Could not create event");
        }
        return event;
    }

    async getMatchingEvents(searchText: string) {
        return this.createQueryBuilder('event')
          .where('event.title like :title', {title: '%' + searchText + '%'})
          .getMany();
    }

    async updateEvent(id: number, event: CreateExternalEventDto): Promise<UpdateResult> {
        return this.createQueryBuilder('external-event').update(ExternalEventEntity)
          .set({
              title: event.title,
              provider: event.provider,
              description: event.description,
              longitude: event.longitude,
              latitude: event.latitude,
              startDate: event.startDate,
              endDate: event.endDate
          })
          .where('id = :id', {id})
          .execute();
    }

    async deleteEvent(id: number): Promise<DeleteResult> {
        try {
            return await this.delete({ id });
        } catch (err) {
            console.log(new InternalServerErrorException(err));
        }
    }
}
