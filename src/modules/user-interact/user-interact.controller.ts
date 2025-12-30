import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UserInteractService } from './user-interact.service';
import { Public } from 'src/decorator/customize';

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

    @Post(':userId/:movieId/remove')
    removeFromFavorites(
        @Param('userId') userId: number,
        @Param('movieId') movieId: number,
    ) {
        return this.userInteractService.removeFromFavorites(userId, movieId);
    }

    @Post(':userId/:movieId/favorite')
    isFavorite(
        @Param('userId') userId: number,
        @Param('movieId') movieId: number,
    ) {
        return this.userInteractService.isFavorite(userId, movieId);
    }
    @Public()
    @Get('recommendation/:movieId')
    getRecommendation(
        @Param('movieId') movieId: number,
        @Query('top_n') topN: number,
    ) {
        return this.userInteractService.getContentBasedRecommendations(
            movieId,
            topN,
        );
    }

    @Get('recommendation/userproflie/:userId')
    @Public()
    recommend(
        @Param('userId') userId: number,
        @Query('page') page = 1,
        @Query('page_size') pageSize = 10,
        @Query('genre') genre?: string,
    ) {
        return this.userInteractService.getProfileRecommendations(
            userId,
            page,
            pageSize,
            genre,
        );
    }
}
