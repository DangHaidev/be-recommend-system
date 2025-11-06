// tmdb.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TmdbService } from './tmdb.services';
import { TmdbController } from './tmdb.controller';
import { TmdbCache } from './entities/tmdb-cache.entity';

@Module({
    imports: [HttpModule, TypeOrmModule.forFeature([TmdbCache])],
    controllers: [TmdbController],
    providers: [TmdbService],
    exports: [TmdbService],
})
export class TmdbModule {}
