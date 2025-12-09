import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private readonly repo: Repository<Event>,
    ) {}

    async logEvent(dto: CreateEventDto) {
        const event = this.repo.create({ ...dto });
        return this.repo.save(event);
    }

    async getEventsByUser(userId: number) {
        return this.repo.find({ where: { userId } });
    }
}
