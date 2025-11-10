import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';

@Injectable()
export class UserInteractService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Movie)
        private movieRepo: Repository<Movie>,
    ) {}

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
        if (!already) {
            user.favoriteMovies.push(movie);
            await this.userRepo.save(user);
        }

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
}
