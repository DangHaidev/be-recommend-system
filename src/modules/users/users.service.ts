import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { hashPasswordhelper } from '../../helper/util';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mailerService: MailerService,
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

    //find user by email
    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestException({ message: 'Email User not found' });
        }
        return user;
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

    async handleRegister(registerDto: CreateAuthDto) {
        const { name, email, password } = registerDto;

        //check if email exist
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        //hashpass
        const hashPassword = await hashPasswordhelper(password);
        if (existingUser) {
            throw new BadRequestException({ message: 'Email already exist' });
        }
        const activecodeId = uuidv4();
        const newUser = this.userRepository.create({
            name,
            email,
            password: hashPassword,
            isActive: false,
            codeId: activecodeId,
            codeExpired: dayjs().add(30, 'minutes'),
        });
        await this.userRepository.save(newUser);
        //send email
        this.mailerService.sendMail({
            to: newUser.email, // list of receivers
            subject: 'Welcome to rcmsys', // Subject line
            template: 'register',
            context: {
                // ✏️ filling curly brackets with content
                name: newUser.name,
                activationCode: activecodeId,
            },
        });

        return {
            id: newUser.id,
        };
    }
}
