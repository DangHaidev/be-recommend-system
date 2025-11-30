import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewReactionDto } from './dto/create-reaction.dto';
import { Public } from 'src/decorator/customize';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewsService: ReviewService) {}

    @Post()
    create(@Body() dto: CreateReviewDto) {
        return this.reviewsService.create(dto);
    }

    @Get('movie/:id')
    @Public()
    getByMovie(@Param('id') id: string) {
        return this.reviewsService.findByMovie(+id);
    }

    @Get('user/:id')
    getByUser(@Param('id') id: string) {
        return this.reviewsService.findByUser(+id);
    }

    @Post('rating/:movieId')
    rateMovie(
        @Param('movieId') movieId: number,
        @Body('userId') userId: number,
        @Body('score') score: number,
    ) {
        return this.reviewsService.rateMovie(userId, movieId, score);
    }

    @Get('rating/:movieId/average')
    getAverageRating(@Param('movieId') movieId: number) {
        return this.reviewsService.getAverageRating(movieId);
    }

    @Get('rating/user/:userId')
    getUserRatings(@Param('userId') userId: number) {
        return this.reviewsService.getUserRatings(userId);
    }

    @Post('react')
    reactToReview(@Req() req, @Body() dto: CreateReviewReactionDto) {
        return this.reviewsService.reactToReview(req.user.id, dto);
    }
}
