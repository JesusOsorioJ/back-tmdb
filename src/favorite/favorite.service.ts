import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favority.entity';
import { User } from '../user/user.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FavoriteService {
  private readonly API_BASE_URL: string;
  private readonly API_KEY: string;

  constructor(
    @InjectRepository(Favorite)
    private favoriteRepo: Repository<Favorite>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.API_BASE_URL = this.configService.get<string>('API_BASE_URL');
    this.API_KEY = this.configService.get<string>('API_KEY');
  }

  async markFavorite(user: User, movieId: string): Promise<string> {
    const existingFavorite = await this.favoriteRepo.findOne({
      where: { user, movieId },
    });

    if (existingFavorite) {
      await this.favoriteRepo.delete({ user, movieId });
    } else {
      const favorite = this.favoriteRepo.create({ user, movieId });
      this.favoriteRepo.save(favorite);
    }

    return 'favorite for movie';
  }

  async getFavorites(user: User): Promise<any[]> {
    const favorites = await this.favoriteRepo.find({ where: { user } });
    const movieDetails = await Promise.all(
      favorites.map(async (fav) => {
        const response = await firstValueFrom(
          this.httpService.get(`${this.API_BASE_URL}/movie/${fav.movieId}`, {
            headers: {
              Authorization: `Bearer ${this.API_KEY}`,
            },
          }),
        );
        return response.data;
      }),
    );
    return movieDetails;
  }

  async getMovieWithFavorites(
    user: User,
    genre?: string,
    keyword?: string,
    page: number = 1,
  ): Promise<any[]> {
    let url = `${this.API_BASE_URL}/discover/movie?page=${page}`;

    if (genre) {
      url = `${this.API_BASE_URL}/discover/movie?page=${page}&with_genres=${genre}`;
    }
    if (keyword) {
      url = `${this.API_BASE_URL}/search/movie?page=${page}&query=${keyword}`;
    }

    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
        },
      }),
    );

    const favorites = await this.favoriteRepo.find({ where: { user } });
    const favoritesMap = new Map();
    favorites.map((d) => favoritesMap.set(d.movieId, d.id));

    const results = response.data.results.map((d) => {
      return { ...d, favorite: !!favoritesMap.get(d.id.toString()) };
    });

    return { ...response.data, results };
  }

  async getMovieById(user: User, movieId: string): Promise<any[]> {
    let response;
    try {
      response = await firstValueFrom(
        this.httpService.get(`${this.API_BASE_URL}/movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${this.API_KEY}`,
          },
        }),
      );
    } catch (error) {
      response = error;
    }

    const favorites = await this.favoriteRepo.find({ where: { user } });
    const favoritesMap = new Map();
    favorites.map((d) => favoritesMap.set(d.movieId, d.id));

    return {
      ...response.data,
      favorite: !!favoritesMap.get(response.data.id?.toString()),
    };
  }
}
