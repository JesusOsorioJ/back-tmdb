import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(user: Partial<User>) {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  findAll() {
    return this.userRepository.find({ where: { deleted: false } });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id, deleted: false } });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email, deleted: false } });
  }

  update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  softDelete(id: number) {
    return this.userRepository.update(id, { deleted: true });
  }
}
