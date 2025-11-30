import { Type } from 'class-transformer';
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

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(10)
    rating?: number;

    @IsInt()
    @Type(() => Number)
    movieId: number;

    @IsInt()
    @Type(() => Number)
    userId: number;
}
