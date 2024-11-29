import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async createUser(user): Promise<User> {
    const userExist = await this.getUser(user.email);
    if (userExist) {
      throw new HttpException('해당 유저가 이미 있습니다.', HttpStatus.BAD_REQUEST);
    }
    return this.userRepository.save(user);
  }

  async getUser(email: string) {
    const result = await this.userRepository.findOne({
      where: { email },
    });
    return result;
  }

  async getUserInfo(id: number) {
    const result = await this.userRepository.findOne({
      where: { id },
    });
    return result;
  }

  async updateUser(email, _user) {
    const userExist = await this.getUser(email);
    if (!userExist) {
      throw new HttpException('해당 유저가 없습니다.', HttpStatus.BAD_REQUEST);
    }
    const user: User = await this.getUser(email);
    user.username = _user.username;
    user.password = _user.password;
    this.userRepository.save(user);
  }

  async deleteUser(email: any) {
    const userExist = await this.getUser(email);
    if (!userExist) {
      throw new HttpException('해당 유저가 없습니다.', HttpStatus.BAD_REQUEST);
    }
    return this.userRepository.delete({ email });
  }
}
