import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EventsService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post('log')
    log(@Body() dto: CreateEventDto) {
        return this.eventsService.logEvent(dto);
    }
    @Get('user/:userId')
    getEventsByUser(@Param('userId') userId: number) {
        return this.eventsService.getEventsByUser(userId);
    }
}
