import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(10)
    rating?: number;

    @IsInt()
    movieId: number;

    @IsInt()
    userId: number;
}
