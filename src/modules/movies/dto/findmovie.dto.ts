export class FindMovieDto {
    current: number;
    pageSize: number;

    genre?: string;
    year?: number;
    language?: string;
}
