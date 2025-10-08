import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from 'src/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly mailerService: MailerService,
    ) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @Public()
    login(@Request() req) {
        return this.authService.login(req.user);
    }

    // @UseGuards(JwtAuthGuard)
    @Public()
    @Post('register')
    register(@Body() registerDto: CreateAuthDto) {
        return this.authService.handleRegister(registerDto);
    }
    @Public()
    @Get('email')
    sendMail() {
        this.mailerService.sendMail({
            to: 'haidangftest@gmail.com', // list of receivers
            subject: 'Testing Nest MailerModule ✔', // Subject line
            html: '<b>welcome</b>', // HTML body content
        });
        return 'ôk';
    }
}
