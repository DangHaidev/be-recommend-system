import {
    Injectable,
    InternalServerErrorException,
    OnModuleInit,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TmdbService } from '../tmbd/tmdb.services';
import MiniSearch from 'minisearch';
import { FindMovieDto } from './dto/findmovie.dto';

@Injectable()
export class MoviesService implements OnModuleInit {
    private miniSearch: MiniSearch;
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepo: Repository<Movie>,
        private readonly tmdbService: TmdbService,
    ) {}
    async onModuleInit() {
        // Khởi tạo MiniSearch
        this.miniSearch = new MiniSearch({
            fields: ['title', 'overview', 'genres'],
            storeFields: ['tmdbId', 'title', 'posterUrl', 'runtime'],
            searchOptions: {
                fuzzy: 0.2,
                prefix: true,
            },
        });
        // Nạp dữ liệu phim từ database
        const movies = await this.movieRepo.find();
        this.miniSearch.addAll(movies);
    }
    async search(keyword: string) {
        return this.miniSearch.search(keyword).slice(0, 10);
    }

    private isFresh(movie: Movie) {
        const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
        // return Date.now() - movie.updatedAt.getTime() < ONE_WEEK;
        return true;
    }

    create(createMovieDto: CreateMovieDto) {
        return 'This action adds a new movie';
    }

    // async findAll(page: number, pageSize: number): Promise<any> {
    //     const [result, total] = await this.movieRepo.findAndCount({
    //         skip: (page - 1) * pageSize,
    //         take: pageSize,
    //     });

    //     return {
    //         data: result,
    //         totalRecords: total,
    //         totalPages: Math.ceil(total / pageSize),
    //         currentPage: page,
    //     };
    // }
    async findAll(dto: FindMovieDto): Promise<any> {
        const { current, pageSize, genre, year, language } = dto;

        const qb = this.movieRepo.createQueryBuilder('movie');

        if (genre) {
            qb.andWhere(':genre = ANY(movie.genres)', { genre });
        }

        if (year) {
            qb.andWhere(
                'movie.releaseDate >= :start AND movie.releaseDate < :end',
                {
                    start: `${year}-01-01`,
                    end: `${Number(year) + 1}-01-01`,
                },
            );
        }

        if (language) {
            qb.andWhere('movie.language = :language', { language });
        }

        qb.skip((current - 1) * pageSize).take(pageSize);

        const [result, total] = await qb.getManyAndCount();

        return {
            meta: {
                current,
                pageSize,
                pages: Math.ceil(total / pageSize),
                total,
            },
            result,
        };
    }

    async findOne(id: number): Promise<Movie> {
        // 1. Check local DB
        const movie = await this.movieRepo.findOne({ where: { tmdbId: id } });

        if (movie) {
            return movie; // Dữ liệu cache vẫn mới
        }

        // 2. Fetch từ TMDB
        // const tmdbData =
        //     await this.tmdbService.getMovieDetails(id);

        // 3. Map và lưu
        const newMovie = await this.tmdbService.getMovieDetails(id);

        if (!newMovie)
            throw new InternalServerErrorException('Movie not found in TMDB');

        await this.movieRepo.save(newMovie);

        return newMovie;
    }

    update(id: number, updateMovieDto: UpdateMovieDto) {
        return `This action updates a #${id} movie`;
    }

    remove(id: number) {
        return `This action removes a #${id} movie`;
    }
}
