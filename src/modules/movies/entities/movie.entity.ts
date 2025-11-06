import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
