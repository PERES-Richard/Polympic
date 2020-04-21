import {DeleteResult, EntityRepository, Repository, UpdateResult} from "typeorm";

import {EventEntity} from "./event.entity";
import {InternalServerErrorException} from "@nestjs/common";
import {CreateEventDto} from "./dto";

@EntityRepository(EventEntity)
export class EventRepository extends Repository<EventEntity> {

    async getEvents(): Promise<EventEntity[]>{
        return this.find({isCancelled: false});
    }

    async createEvent(createEventDto: CreateEventDto): Promise<EventEntity> {
        const event = new EventEntity();

        event.title = createEventDto.title;
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
          .where("event.title like :title", {title: '%' + searchText + '%'})
          .getMany();
    }

    async updateEvent(id: number, event: CreateEventDto): Promise<UpdateResult> {
        return this.createQueryBuilder('event').update(EventEntity)
          .set({
              title: event.title,
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
