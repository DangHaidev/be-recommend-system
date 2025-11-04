// tmdb.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { TmdbService } from './tmdb.services';
import { Public } from 'src/decorator/customize';

@Controller('tmdb')
@Public()
export class TmdbController {
    constructor(private readonly tmdbService: TmdbService) {}

    @Get('popular')
    getPopular() {
        return this.tmdbService.getPopularMovies();
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
