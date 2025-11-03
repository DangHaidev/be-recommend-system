/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TmdbCache } from './entities/tmdb-cache.entity';

@Injectable()
export class TmdbService {
    private readonly baseUrl = 'https://api.themoviedb.org/3';

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @InjectRepository(TmdbCache)
        private readonly cacheRepo: Repository<TmdbCache>,
    ) {}

    private get apiKey() {
        return this.configService.get<string>('TMDB_API_KEY');
    }

    /** Lấy cache từ DB (nếu còn hiệu lực) */
    private async getCache(
        type: string,
        ttlHours: number,
    ): Promise<any | null> {
        const expireTime = new Date(Date.now() - ttlHours * 60 * 60 * 1000);
        const cache = await this.cacheRepo.findOne({
            where: { type },
            order: { createdAt: 'DESC' },
        });

        if (cache && cache.createdAt > expireTime) {
            console.log(`✅ Dữ liệu '${type}' lấy từ cache`);
            return cache.data;
        }

        return null;
    }

    /** Lưu cache mới vào DB */
    private async setCache(type: string, data: any) {
        await this.cacheRepo.save({ type, data });
    }

    /** Hàm tiện ích: gọi TMDB API + cache */
    private async fetchAndCache(type: string, url: string, ttlHours = 12) {
        const cached = await this.getCache(type, ttlHours);
        if (cached) return cached;

        console.log(`🌐 Gọi TMDB API (${type})...`);
        const { data } = await firstValueFrom(this.httpService.get(url));

        await this.setCache(type, data);
        return data;
    }

    // -----------------------------
    // Các API cụ thể:
    // -----------------------------

    async getPopularMovies() {
        const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=vi-VN&page=1`;
        return this.fetchAndCache('popular', url, 12);
    }

    async getTopRatedMovies() {
        const url = `${this.baseUrl}/movie/top_rated?api_key=${this.apiKey}&language=vi-VN&page=1`;
        return this.fetchAndCache('top_rated', url, 24);
    }

    async getTrendingMovies() {
        const url = `${this.baseUrl}/trending/movie/day?api_key=${this.apiKey}&language=vi-VN`;
        return this.fetchAndCache('trending', url, 6);
    }

    async getUpcomingMovies() {
        const url = `${this.baseUrl}/movie/upcoming?api_key=${this.apiKey}&language=vi-VN&page=1`;
        return this.fetchAndCache('upcoming', url, 24);
    }

    async searchMovies(query: string) {
        const type = `search:${query.toLowerCase()}`;
        const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&language=vi-VN&query=${encodeURIComponent(query)}`;
        return this.fetchAndCache(type, url, 3); // search TTL ngắn hơn
    }
}
