/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Review } from './entity/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { MovieRating } from './entity/movie-rating.entity';
@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Movie)
        private readonly movieRepo: Repository<Movie>,
        @InjectRepository(MovieRating)
        private readonly ratingRepo: Repository<MovieRating>,
    ) {}

    async create(createReviewDto: CreateReviewDto) {
        const { content, rating, movieId, userId } = createReviewDto;

        const user = await this.userRepo.findOneBy({ id: userId });
        const movie = await this.movieRepo.findOneBy({ tmdbId: movieId });

        if (!user || !movie)
            throw new NotFoundException('User hoặc Movie không tồn tại');

        const review = this.reviewRepo.create({
            content,
            rating,
            user,
            movie,
        });

        return this.reviewRepo.save(review);
    }

    async findByMovie(movieId: number) {
        // return this.reviewRepo.find({
        //     where: { movie: { tmdbId: movieId } },
        //     relations: ['user'],
        //     order: { createdAt: 'DESC' },
        // });
        const reviews = await this.reviewRepo
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.user', 'u')
            .leftJoinAndSelect('review.movie', 'm')
            .where('m.tmdbId = :tmdbId', { tmdbId: movieId })
            .select([
                'review.id',
                'review.content',
                'review.rating',
                'review.createdAt',
                'u.id',
                'u.name',
                'u.image',
            ])
            .orderBy('review.createdAt', 'DESC')
            .getRawMany();

        // getRawMany trả về cột dạng alias: 'review_id', 'user_id', ...
        return reviews.map((r) => ({
            id: r.review_id,
            content: r.review_content,
            rating: r.review_rating,
            createdAt: r.review_createdAt,
            user: {
                id: r.u_id,
                username: r.u_name,
                image: r.u_image,
            },
        }));
    }

    async findByUser(userId: number) {
        // return this.reviewRepo.find({
        //     where: { user: { id: userId } },
        //     relations: ['movie'],
        //     order: { createdAt: 'DESC' },
        // });
        const reviews = await this.reviewRepo
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.user', 'u')
            .leftJoinAndSelect('review.movie', 'm')
            .where('u.id = :id', { id: userId })
            .select([
                'review.id',
                'review.content',
                'review.rating',
                'review.createdAt',
                'm.tmdbId',
                'm.title',
                'm.releaseDate',
                'm.rating',
            ])
            .orderBy('review.createdAt', 'DESC')
            .getRawMany();

        // getRawMany trả về cột dạng alias: 'review_id', 'user_id', ...
        return reviews.map((r) => ({
            id: r.review_id,
            content: r.review_content,
            rating: r.review_rating,
            createdAt: r.review_createdAt,
            movie: {
                tmdbId: r.m_tmdbId,
                title: r.m_title,
                releaseDate: r.m_releaseDate,
                rating: r.m_rating,
            },
        }));
    }

    // User chấm điểm (nếu đã có => update)
    async rateMovie(userId: number, movieId: number, score: number) {
        if (score < 0 || score > 10) {
            throw new Error('Điểm rating phải nằm trong khoảng 0-10');
        }

        const movie = await this.movieRepo.findOne({
            where: { tmdbId: movieId },
        });
        if (!movie) throw new Error('Không tìm thấy phim');

        const existing = await this.ratingRepo.findOne({
            where: { user: { id: userId }, movie: { id: movie.id } },
            relations: ['user', 'movie'],
        });

        if (existing) {
            existing.rating = score;
            return this.ratingRepo.save(existing);
        } else {
            const newRating = this.ratingRepo.create({
                rating: score,
                user: { id: userId } as User,
                movie,
            });
            return this.ratingRepo.save(newRating);
        }
    }

    // Lấy trung bình điểm của 1 phim
    async getAverageRating(tmdbId: number) {
        const result = await this.ratingRepo
            .createQueryBuilder('rating')
            .leftJoin('rating.movie', 'movie')
            .select('AVG(rating.rating)', 'avg')
            .where('movie.tmdbId = :tmdbId', { tmdbId })
            .getRawOne();

        return Number(result.avg) || 0;
    }

    // Lấy danh sách phim user đã rating
    async getUserRatings(userId: number) {
        return this.ratingRepo.find({
            where: { user: { id: userId } },
            relations: ['movie'],
        });
    }
}
