import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewsService: ReviewService) {}

    @Post()
    create(@Body() dto: CreateReviewDto) {
        return this.reviewsService.create(dto);
    }

    @Get('movie/:id')
    getByMovie(@Param('id') id: string) {
        return this.reviewsService.findByMovie(+id);
    }

    @Get('user/:id')
    getByUser(@Param('id') id: string) {
        return this.reviewsService.findByUser(+id);
    }
}
