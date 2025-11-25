import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { MovieRating } from './entity/movie-rating.entity';
import { ReviewReaction } from './entity/review-reaction.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Review,
            User,
            Movie,
            MovieRating,
            ReviewReaction,
        ]),
    ],
    controllers: [ReviewController],
    providers: [ReviewService],
    exports: [ReviewService],
})
export class ReviewModule {}
