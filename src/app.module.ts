import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/users/users.module';
import { User } from './modules/users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TransformInterceptor } from './core/transform.interceptor';
import { TmdbModule } from './modules/tmbd/tmdb.module';
import { TmdbCache } from './modules/tmbd/entities/tmdb-cache.entity';
import { Movie } from './modules/movies/entities/movie.entity';
import { MoviesModule } from './modules/movies/movies.module';
import { UserInteractModule } from './modules/user-interact/user-interact.module';
import { ReviewModule } from './modules/review/review.module';
import { Review } from './modules/review/entity/review.entity';
import { MovieRating } from './modules/review/entity/movie-rating.entity';
import { ReviewReaction } from './modules/review/entity/review-reaction.entity';
import { Event } from './modules/event/entities/event.entity';
import { EventModule } from './modules/event/event.module';

@Module({
    imports: [
        TmdbModule,
        UserModule,
        AuthModule,
        MoviesModule,
        UserInteractModule,
        ReviewModule,
        EventModule,
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: +configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                entities: [
                    User,
                    TmdbCache,
                    Movie,
                    Review,
                    MovieRating,
                    ReviewReaction,
                    Event,
                ],
                synchronize: true, //use synchronize false for production
            }),
            inject: [ConfigService],
        }),

        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 465,
                    // ignoreTLS: true,
                    secure: true,
                    auth: {
                        user: configService.get('MAIL_USER'),
                        pass: configService.get('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: '"No Reply" <no-reply@localhost>',
                },
                // preview: true,
                template: {
                    dir: process.cwd() + '/src/mail/templates/',
                    adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
})
export class AppModule {}
