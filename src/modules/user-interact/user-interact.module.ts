import { Module } from '@nestjs/common';
import { UserInteractService } from './user-interact.service';
import { UserInteractController } from './user-interact.controller';
import { UserModule } from '../users/users.module';
import { MoviesModule } from '../movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';

@Module({
    controllers: [UserInteractController],
    providers: [UserInteractService],
    imports: [
        TypeOrmModule.forFeature([User, Movie]),
        UserModule,
        MoviesModule,
    ],
    exports: [UserInteractService],
})
export class UserInteractModule {}
