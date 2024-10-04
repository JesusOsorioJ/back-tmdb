import { Controller, Get, Query, Param } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // Obtener una película por ID
  @Get('/get/genres')
  async getGenres() {
    return this.movieService.getGenres();
  }

  // Obtener todas las películas por género, palabra clave y con paginación
  @Get()
  async getMovies(
    @Query('genre') genre?: string,
    @Query('keyword') keyword?: string,
    @Query('page') page: number = 1,
  ) {
    return this.movieService.getMovies(genre, keyword, page);
  }

  // Obtener una película por ID
  @Get(':id')
  async getMovieById(@Param('id') id: string) {
    return this.movieService.getMovieById(id);
  }
}
