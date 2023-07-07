import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    const savedUser = await this.repo.save(user);

    return savedUser;
  }

  async findOne(id: number) {
    if (!id) return null;
    const user = await this.repo.findOne({
      where: { id },
    });
    return user;
  }

  async find(email: string) {
    const users = await this.repo.find({ where: { email } });

    return users;
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    Object.assign(user, attrs);

    const modUser = await this.repo.save(user);

    return modUser;
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return await this.repo.remove(user);
  }
}
