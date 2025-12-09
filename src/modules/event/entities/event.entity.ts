import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number;

    @Column({ nullable: true })
    movieId: number;

    @Column()
    eventName: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
