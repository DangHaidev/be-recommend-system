import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    Unique,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Review } from './review.entity';

@Entity('review_reactions')
@Unique(['user', 'review'])
export class ReviewReaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.reactions, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Review, (review) => review.reactions, {
        onDelete: 'CASCADE',
    })
    review: Review;

    @Column({ type: 'enum', enum: ['like', 'dislike'] })
    type: 'like' | 'dislike';
}
