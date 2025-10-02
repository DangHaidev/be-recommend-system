import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
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
    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);
        if (!user) {
            throw new BadRequestException({ message: 'User not found' });
        }

        const updateUser = this.userRepository.merge(user, updateUserDto);
        return await this.userRepository.save(updateUser);
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
