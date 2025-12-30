import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Public } from 'src/decorator/customize';
import { FindMovieDto } from './dto/findmovie.dto';

@Controller('movies')
@Public()
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    // @Post()
    // create(@Body() createMovieDto: CreateMovieDto) {
    //     return this.moviesService.create(createMovieDto);
    // }

    // @Get()
    // findAll(
    //     @Query('page') page: number = 1,
    //     @Query('pageSize') pageSize: number = 12,
    // ) {
    //     return this.moviesService.findAll(page, pageSize);
    // }

    @Post()
    findAll(@Body() dto: FindMovieDto) {
        return this.moviesService.findAll(dto);
    }
    @Get('search')
    search(@Query('q') keyword: string) {
        return this.moviesService.search(keyword);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.moviesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
        return this.moviesService.update(+id, updateMovieDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.moviesService.remove(+id);
    }
}
