// src/modules/movies/entities/movie-rating.entity.ts
import { Movie } from 'src/modules/movies/entities/movie.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('movie_ratings')
@Unique(['user', 'movie']) // mỗi user chỉ được rating 1 lần / phim
export class MovieRating {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Movie, (movie) => movie.ratings, { onDelete: 'CASCADE' })
    movie: Movie;

    @Column({ type: 'float', nullable: false })
    rating: number; // ví dụ: 8.5

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
