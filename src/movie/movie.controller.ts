import { Controller, Get, Query, Param } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/get/genres')
  async getGenres(@Query('language') language?: string) {
    return this.movieService.getGenres(language);
  }

  @Get()
  async getMovies(@Query('language') language?: string) {
    return this.movieService.getMovies(language);
  }

  @Get(':id')
  async getMovieById(@Param('id') id: string) {
    return this.movieService.getMovieById(id);
  }
}
