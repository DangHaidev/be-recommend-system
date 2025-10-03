import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashPasswordhelper } from '../../helper/util';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // create user
    async create(createUserDto: CreateUserDto): Promise<User> {
        const { name, email, password } = createUserDto;

        //check if email exist
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        //hashpass
        const hashPassword = await hashPasswordhelper(password);
        if (existingUser) {
            throw new BadRequestException({ message: 'Email already exist' });
        }

        const newUser = this.userRepository.create({
            name,
            email,
            password: hashPassword,
        });
        return await this.userRepository.save(newUser);
    }

    //read all user
    async findAll(page: number, pageSize: number): Promise<any> {
        const [result, total] = await this.userRepository.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            data: result,
            totalRecords: total,
            totalPages: Math.ceil(total / pageSize),
            currentPage: page,
        };
    }

    //read single user
    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new BadRequestException({ message: 'User not found' });
        }
        return user;
    }

    //update user
    async update(id: number, updateData: Partial<User>): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        Object.assign(user, updateData); // merge data
        return this.userRepository.save(user);
    }

    //delete user
    async remove(id: number): Promise<User> {
        const user = await this.findOne(id);
        if (!user) {
            throw new BadRequestException({ message: 'User not found' });
        }
        return await this.userRepository.remove(user);
    }
}
