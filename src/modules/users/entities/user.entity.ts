import { Column, Entity } from 'typeorm';

@Entity({ name: 'cities' })
export class User {
    @Column()
    name: string;

    @Column({ type: 'text' })
    email: string;

    @Column({})
    password: string;

    // @Column({})
    // phone: string;

    // @Column({})
    // address: string;

    // @Column({})
    // image: string;

    // @Column({})
    // role: string;

    // @Column({})
    // accountType: string;

    @Column({ type: 'boolean', default: false })
    isActive: boolean;

    // @Column({})
    // codeId: string;

    // @Column({})
    // codeExpired: Date;
}
