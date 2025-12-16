import {
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Public } from 'src/decorator/customize';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class UserInteractService {
    private readonly fastApiBaseUrl =
        'http://localhost:8000/recommend/contentbased';
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

        // Check xem phim đã trong danh sách chưa
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
        // const url = `http://localhost:8000/recommend/contentbased/${tmdbId}?top_n=${topN}`;

        try {
            const res = await axios.get(
                `${this.fastApiBaseUrl}/${tmdbId}?top_n=${topN}`,
            );
            const recommendations = res.data?.recommendations;

            if (!recommendations || recommendations.length === 0) {
                return [];
            }

            // Bước 2: Gọi TMDb API cho từng phim
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
                        // nếu không tìm thấy phim hoặc lỗi, bỏ qua
                        return null;
                    }
                }),
            );
            // Lọc bỏ null
            return movies.filter((m) => m !== null);
        } catch (error) {
            throw new HttpException(
                'Failed to fetch recommendations',
                HttpStatus.BAD_GATEWAY,
            );
        }
    }
}
