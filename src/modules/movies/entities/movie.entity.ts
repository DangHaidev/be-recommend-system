import { Review } from 'src/modules/review/entity/review.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
    Column,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('movies')
export class Movie {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    tmdbId: number;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    overview: string;

    @Column({ nullable: true })
    releaseDate: string;

    @Column({ nullable: true })
    posterUrl: string;

    @Column({ nullable: true })
    backdropUrl: string;

    @Column({ type: 'float', nullable: true })
    rating: number;

    @Column({ type: 'text', array: true, default: [] })
    genres: string[];

    @Column({ nullable: true })
    runtime: number;

    @Column({ nullable: true })
    language: string;

    @Column({ nullable: true })
    trailer: string;

    // Quan hệ nhiều-nhiều với User
    @ManyToMany(() => User, (user) => user.favoriteMovies)
    favoritedBy?: User[];
    @OneToMany(() => Review, (review) => review.movie)
    reviews?: Review[];
}
