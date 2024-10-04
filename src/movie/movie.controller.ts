import { Controller, Get, Query, Param } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/get/genres')
  async getGenres() {
    return this.movieService.getGenres();
  }

  @Get()
  async getMovies(
    @Query('genre') genre?: string,
    @Query('keyword') keyword?: string,
    @Query('page') page: number = 1,
  ) {
    return this.movieService.getMovies(genre, keyword, page);
  }

  @Get(':id')
  async getMovieById(@Param('id') id: string) {
    return this.movieService.getMovieById(id);
  }
}
