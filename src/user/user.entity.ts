import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Favorite } from '../favorite/favority.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  deleted: boolean;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];
}
