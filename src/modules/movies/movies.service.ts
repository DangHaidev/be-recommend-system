import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TmdbService } from '../tmbd/tmdb.services';
import { mapTmdbMovieToEntity } from './utils/movies.mapper';

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepo: Repository<Movie>,
        private readonly tmdbService: TmdbService,
    ) {}

    private isFresh(movie: Movie) {
        const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
        // return Date.now() - movie.updatedAt.getTime() < ONE_WEEK;
        return true;
    }

    create(createMovieDto: CreateMovieDto) {
        return 'This action adds a new movie';
    }

    findAll() {
        return `This action returns all movies`;
    }

    async findOne(id: number): Promise<Movie> {
        // 1. Check local DB
        const movie = await this.movieRepo.findOne({ where: { tmdbId: id } });

        if (movie) {
            return movie; // Dữ liệu cache vẫn mới
        }

        // 2. Fetch từ TMDB
        const tmdbData = await this.tmdbService.getMovieDetails(id);

        // 3. Map và lưu
        const newMovie = this.movieRepo.create(mapTmdbMovieToEntity(tmdbData));
        await this.movieRepo.save(newMovie);

        return newMovie;
    }

    update(id: number, updateMovieDto: UpdateMovieDto) {
        return `This action updates a #${id} movie`;
    }

    remove(id: number) {
        return `This action removes a #${id} movie`;
    }
}
