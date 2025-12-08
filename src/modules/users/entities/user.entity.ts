import { Movie } from 'src/modules/movies/entities/movie.entity';
import { MovieRating } from 'src/modules/review/entity/movie-rating.entity';
import { ReviewReaction } from 'src/modules/review/entity/review-reaction.entity';
import { Review } from 'src/modules/review/entity/review.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    image: string;

    @Column('text', { array: true, nullable: true })
    genres: string[];

    @Column({ default: 'USER' })
    role: string;

    @Column({ default: 'LOCAL' })
    accountType: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ nullable: true })
    codeId: string;

    @Column({ nullable: true })
    codeExpired: Date;

    @ManyToMany(() => Movie, (movie) => movie.favoritedBy, { cascade: true })
    @JoinTable()
    favoriteMovies: Movie[];

    @OneToMany(() => Review, (review) => review.user)
    reviews?: Review[];

    @OneToMany(() => MovieRating, (rating) => rating.user)
    ratings?: MovieRating[];

    @OneToMany(() => ReviewReaction, (reaction) => reaction.user)
    reactions: ReviewReaction[];
}
