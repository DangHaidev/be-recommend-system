import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Public } from 'src/decorator/customize';

@Controller('movies')
@Public()
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Post()
    create(@Body() createMovieDto: CreateMovieDto) {
        return this.moviesService.create(createMovieDto);
    }

    @Get()
    findAll() {
        return this.moviesService.findAll();
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
