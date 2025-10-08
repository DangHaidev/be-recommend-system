import { Injectable, UnauthorizedException } from '@nestjs/common';
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
        const isValidEmail = await comparePasswordhelper(pass, user.password);

        if (!isValidEmail || !user) {
            return null;
        }
        return user;
    }
    async login(user: any) {
        const payload = { username: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    handleRegister = async (registerDto: CreateAuthDto) => {
        return await this.usersService.handleRegister(registerDto);
    };
}
