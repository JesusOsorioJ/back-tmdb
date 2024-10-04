import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './favority.entity';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { UserModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    HttpModule,
    UserModule,
    ConfigModule,
  ], // Usa HttpModule en lugar de HttpClientModule
  providers: [FavoriteService],
  controllers: [FavoriteController],
})
export class FavoriteModule {}
