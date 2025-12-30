// tmdb.controller.ts
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TmdbService } from './tmdb.services';
import { Public } from 'src/decorator/customize';
import { PaginateDto } from './dto/paginate.dto';

@Controller('tmdb')
@Public()
export class TmdbController {
    constructor(private readonly tmdbService: TmdbService) {}

    @Get('popular')
    getPopular() {
        return this.tmdbService.getPopularMovies();
    }
    @Post('post-popular')
    async postPopular(@Body() body: PaginateDto) {
        const { current, pageSize } = body;
        return this.tmdbService.getPopularMovies2(current, pageSize);
    }

    @Get('top-rated')
    getTopRated() {
        return this.tmdbService.getTopRatedMovies();
    }

    @Get('trending')
    getTrending() {
        return this.tmdbService.getTrendingMovies();
    }

    @Get('upcoming')
    getUpcoming() {
        return this.tmdbService.getUpcomingMovies();
    }

    @Get('search')
    search(@Query('q') query: string) {
        return this.tmdbService.searchMovies(query);
    }
}
