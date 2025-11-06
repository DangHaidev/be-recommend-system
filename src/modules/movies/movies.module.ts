import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TmdbModule } from '../tmbd/tmdb.module';
import { Movie } from './entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Movie]), TmdbModule],
    controllers: [MoviesController],
    providers: [MoviesService],
    exports: [MoviesService],
})
export class MoviesModule {}
