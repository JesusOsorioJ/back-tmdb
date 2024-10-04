import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post(':movieId')
  async markFavorite(@Param('movieId') movieId: string, @Req() req: any) {
    const user = req.user;
    return this.favoriteService.markFavorite(user, movieId);
  }

  @Get()
  async getFavorites(@Req() req: any) {
    const user = req.user;
    return this.favoriteService.getFavorites(user);
  }

  @Get('getMovie/withFavorites')
  async getMovieWithFavorites(
    @Req() req: any,
    @Query('genre') genre?: string,
    @Query('keyword') keyword?: string,
    @Query('page') page: number = 1,
  ) {
    const user = req.user;
    return this.favoriteService.getMovieWithFavorites(
      user,
      genre,
      keyword,
      page,
    );
  }

  @Get('getById/:id')
  async getMovieById(@Req() req: any, @Param('id') id: string) {
    const user = req.user;
    return this.favoriteService.getMovieById(user, id);
  }
}
