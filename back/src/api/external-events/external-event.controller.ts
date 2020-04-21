import {Body, Controller, Post, Get, Param, Put} from '@nestjs/common';
import {CreateExternalEventDto} from './dto';
import { ExternalEventService } from './external-event.service';
import {ApiCreatedResponse} from "@nestjs/swagger";
import {ExternalEventEntity} from "./external-event.entity";

/**
 * event is the default route to manipulate events
 */
@Controller('external-event')
export class ExternalEventController {

    constructor(private readonly eventService: ExternalEventService) {}

    @Get()
    async getEvents() {
        return this.eventService.getEvents();
    }

    @Get('/search/:searchText')
    @ApiCreatedResponse({
        description: 'A list of external events matching the given string',
        type: [ExternalEventEntity],
    })
    async searchEvent(
        @Param('searchText') searchText: string
    ){
        return this.eventService.searchEvents(searchText);
    }

    @Post()
    async addEvent(
        @Body() body: CreateExternalEventDto,
    ) {
        return this.eventService.addEventPosition(body);
    }

    @Put('/:id')
    async updateEvent(
        @Param('id') id: number,
        @Body() body: CreateExternalEventDto,
    ) {
        return this.eventService.updateEvent(id, body);
    }
}
