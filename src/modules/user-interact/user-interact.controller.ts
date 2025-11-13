import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserInteractService } from './user-interact.service';

@Controller('user-interact')
export class UserInteractController {
    constructor(private readonly userInteractService: UserInteractService) {}

    @Post(':userId/:movieId')
    addToFavorites(
        @Param('userId') userId: number,
        @Param('movieId') movieId: number,
    ) {
        return this.userInteractService.addToFavorites(userId, movieId);
    }

    @Get(':userId')
    getFavorites(@Param('userId') userId: number) {
        return this.userInteractService.getFavorites(userId);
    }
}
