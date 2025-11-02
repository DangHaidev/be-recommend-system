// tmdb-cache.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity()
export class TmdbCache {
    @PrimaryGeneratedColumn()
    id: number;

    // loại nội dung: 'popular', 'top_rated', 'trending', 'upcoming', 'search:batman'
    @Column()
    type: string;

    // dữ liệu TMDB JSON
    @Column({ type: 'jsonb' })
    data: any;

    // thời điểm cache
    @CreateDateColumn()
    createdAt: Date;
}
