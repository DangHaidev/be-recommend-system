import {
    Injectable,
    NotAcceptableException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordhelper } from 'src/helper/util';
import { UserService } from 'src/modules/users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) {}
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(username);
        const isValidPassword = await comparePasswordhelper(
            pass,
            user.password,
        );

        if (!isValidPassword || !user) {
            return null;
        }
        if (user.isActive === false) {
            throw new NotAcceptableException('tài khoản chưa được kích hoạt');
        }
        return user;
    }
    async login(user: any) {
        const payload = { username: user.email, sub: user.id };
        return {
            user: {
                email: user.email,
                id: user.id,
                name: user.name,
            },
            access_token: this.jwtService.sign(payload),
        };
    }

    handleRegister = async (registerDto: CreateAuthDto) => {
        return await this.usersService.handleRegister(registerDto);
    };
}
