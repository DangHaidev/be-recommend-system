import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
