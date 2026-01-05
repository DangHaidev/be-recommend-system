import {
    BadGatewayException,
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class UserInteractService {
    // private readonly fastApiBaseUrl = 'http://localhost:8000';
    private readonly tmdbBaseUrl = 'https://api.themoviedb.org/3/movie';
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Movie)
        private movieRepo: Repository<Movie>,
        private readonly movieService: MoviesService,
    ) {}
    private get apiKey() {
        return this.configService.get<string>('TMDB_API_KEY');
    }
    private get fastApiBaseUrl() {
        return this.configService.get<string>('FAST_API_BASEURL');
    }

    async addToFavorites(userId: number, movieId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['favoriteMovies'],
        });
        if (!user) throw new NotFoundException('User not found');

        const movie = await this.movieRepo.findOne({
            where: { tmdbId: movieId },
        });
        if (!movie) throw new NotFoundException('Movie not found');

        // Check movie exists
        const already = user.favoriteMovies.find((m) => m.id === movie.id);
        if (already) {
            throw new ConflictException('Da co trong danh sach yeu thich');
        }
        user.favoriteMovies.push(movie);
        await this.userRepo.save(user);

        return user.favoriteMovies;
    }

    async getFavorites(userId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['favoriteMovies'],
        });
        if (!user) throw new NotFoundException('User not found');
        return user.favoriteMovies;
    }

    async removeFromFavorites(userId: number, movieId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['favoriteMovies'],
        });
        if (!user) throw new NotFoundException('User not found');

        const movie = await this.movieRepo.findOne({
            where: { tmdbId: movieId },
        });
        if (!movie) throw new NotFoundException('Movie not found');

        user.favoriteMovies = user.favoriteMovies.filter(
            (m) => m.id !== movie.id,
        );
        await this.userRepo.save(user);

        return user.favoriteMovies;
    }
    // check movie is favorite of user or not
    async isFavorite(userId: number, movieId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['favoriteMovies'],
        });

        if (!user) throw new NotFoundException('User not found');

        const movie = await this.movieRepo.findOne({
            where: { tmdbId: movieId },
        });
        if (!movie) throw new NotFoundException('Movie not found');

        return user.favoriteMovies.some((m) => m.id === movie.id);
    }

    async getContentBasedRecommendations(tmdbId: number, topN: number) {
        try {
            const res = await axios.get(
                `${this.fastApiBaseUrl}/recommend/contentbased/${tmdbId}?top_n=${topN}`,
            );
            const recommendations = res.data?.recommendations;

            if (!recommendations || recommendations.length === 0) {
                return [];
            }

            // Bước 2: call TMDb API for each movie
            const movies = await Promise.all(
                recommendations.map(async (rec) => {
                    try {
                        const movie = await this.movieService.findOne(
                            rec.tmdbId,
                        );
                        return {
                            ...movie,
                            sim: rec.sim,
                            localTitle: rec.Title,
                        };
                    } catch (err) {
                        // if movie not found or error, skip
                        return null;
                    }
                }),
            );
            // skip null
            return movies.filter((m) => m !== null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                // FastAPI return 404
                if (status === 404) {
                    try {
                        const url = `${this.tmdbBaseUrl}/${tmdbId}/recommendations?api_key=${this.apiKey}&language=vi-VN&page=1`;
                        const { data } = await firstValueFrom(
                            this.httpService.get(url),
                        );
                        // Bước 2: call TMDb API for each movie
                        const movies = await Promise.all(
                            data.results.map(async (rec) => {
                                try {
                                    const movie =
                                        await this.movieService.findOne(rec.id);
                                    return {
                                        ...movie,
                                    };
                                } catch (err) {
                                    return null;
                                }
                            }),
                        );
                        return movies;
                    } catch (error) {
                        const err = error as AxiosError;

                        // TMDB return error HTTP
                        if (err.response) {
                            const status = err.response.status;

                            if (status === 404) {
                                throw new NotFoundException(
                                    `Movie ${tmdbId} not found on TMDB`,
                                );
                            }

                            throw new BadGatewayException(
                                'TMDB recommendation API failed',
                            );
                        }

                        // can not connect TMDB
                        throw new ServiceUnavailableException(
                            'TMDB service unavailable',
                        );
                    }
                }

                // Validation / bad request from FastAPI
                if (status === 400 || status === 422) {
                    throw new HttpException(
                        error.response?.data?.detail ??
                            'Invalid recommendation request',
                        status,
                    );
                }

                // FastAPI run but have error inside
                if (status && status >= 500) {
                    throw new BadGatewayException(
                        'Recommendation service failed',
                    );
                }

                // can not connect FastAPI
                if (
                    error.code === 'ECONNREFUSED' ||
                    error.code === 'ETIMEDOUT'
                ) {
                    throw new ServiceUnavailableException(
                        'Recommendation service unavailable',
                    );
                }
            }
            throw new BadGatewayException('Failed to fetch recommendations');
        }
    }

    async getProfileRecommendations(
        userId: number,
        page = 1,
        pageSize = 10,
        genre?: string,
    ) {
        try {
            const res = await axios.get(
                `${this.fastApiBaseUrl}/recommend/userprofile/${userId}?page=${page}&page_size=${pageSize}`,
            );
            const recommendations = res.data?.recommendations;

            if (!recommendations || recommendations.length === 0) {
                return [];
            }

            // step 2: call tmdb api for each movie
            const movies = await Promise.all(
                recommendations.map(async (rec) => {
                    try {
                        const movie = await this.movieService.findOne(
                            rec.tmdbId,
                        );
                        return {
                            ...movie,
                            sim: rec.sim,
                            localTitle: rec.Title,
                        };
                    } catch (err) {
                        return null;
                    }
                }),
            );
            // check null
            const filteredMovies = movies.filter((m) => m !== null);
            const data = genre
                ? filteredMovies.filter((item) => item.genres.includes(genre))
                : filteredMovies;

            return data;
        } catch (error) {
            throw new HttpException(
                'Failed to fetch recommendations',
                HttpStatus.BAD_GATEWAY,
            );
        }
    }
}
