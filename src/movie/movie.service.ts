import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MovieService {
  private readonly API_BASE_URL: string;
  private readonly API_KEY: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.API_BASE_URL = this.configService.get<string>('API_BASE_URL');
    this.API_KEY = this.configService.get<string>('API_KEY');
  }

  async getGenres() {
    const url = `${this.API_BASE_URL}/genre/movie/list`;
    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
        },
      }),
    );
    return response.data;
  }

  async getMovies(genre?: string, keyword?: string, page: number = 1) {
    let url = `${this.API_BASE_URL}/discover/movie?page=${page}`;

    if (genre) {
      url = `${this.API_BASE_URL}/discover/movie?page=${page}&genre=${genre}`;
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
    return response.data;
  }

  async getMovieById(movieId: string) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.API_BASE_URL}/${movieId}`, {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
        },
      }),
    );
    return response.data;
  }
}
