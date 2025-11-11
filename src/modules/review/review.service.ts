import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Review } from './entity/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Movie)
        private readonly movieRepo: Repository<Movie>,
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
}
