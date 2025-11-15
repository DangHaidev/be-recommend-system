import { IsEnum, IsNumber } from 'class-validator';

export class CreateReviewReactionDto {
    @IsNumber()
    reviewId: number;

    @IsEnum(['like', 'dislike'])
    type: 'like' | 'dislike';
}
