import {Body, Controller, Post, Get, Param, Put} from '@nestjs/common';
import {CreateEventDto} from './dto';
import { EventService } from './event.service';
import {ApiCreatedResponse} from "@nestjs/swagger";
import {EventEntity} from "./event.entity";

/**
 * event is the default route to manipulate events
 */
@Controller('event')
export class EventController {

    constructor(private readonly eventService: EventService) {}

    @Get()
    @ApiCreatedResponse({
        description: 'The list of all events',
        type: [EventEntity],
    })
    async getEvents() {
        return this.eventService.getEvents();
    }

    @Get('/search/:searchText')
    @ApiCreatedResponse({
        description: 'A list of all events matching the given string',
        type: [EventEntity],
    })
    async searchEvent(
        @Param('searchText') searchText: string
    ){
        return this.eventService.searchEvents(searchText);
    }

    @Post()
    @ApiCreatedResponse({
        description: 'The event has been successfully created',
        type: EventEntity,
    })
    async addEvent(
        @Body() body: CreateEventDto,
    ) {
        return this.eventService.addEventPosition(body, true);
    }

    @Put('/:id')
    @ApiCreatedResponse({
        description: 'The event has been successfully updated',
        type: EventEntity,
    })
    async updateEvent(
        @Param('id') id: number,
        @Body() body: CreateEventDto,
    ) {
        return this.eventService.updateEvent(id, body);
    }

    @Get('init_sse_connection')
    @ApiCreatedResponse({
        description: 'The sse connection to get all event updates has been created',
    })
    async initSSEConnection(){}
}
