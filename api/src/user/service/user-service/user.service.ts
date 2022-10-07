import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { UserEntity } from 'src/user/model/user.entity';
import { UserI } from 'src/user/model/user.interface';

import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(newUser: UserI): Promise<UserI> {
    try {
      const exists: boolean = await this.mailExists(newUser.email);
      if (!exists) {
        const passwordHash: string = await this.hashPassword(newUser.password);
        newUser.password = passwordHash;
        const user = await this.userRepository.save(
          this.userRepository.create(newUser),
        );
        return this.findOne(user.id);
      } else {
        throw new HttpException('邮箱已被使用', HttpStatus.CONFLICT);
      }
    } catch {
      throw new HttpException('邮箱已被使用', HttpStatus.CONFLICT);
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<UserI>> {
    return paginate<UserEntity>(this.userRepository, options);
  }
  private async hashPassword(password: string): Promise<string> {
    return `${password}crypted`;
  }

  private async findOne(id: number): Promise<UserI> {
    return this.userRepository.findOneBy({
      id: id,
    });
  }

  async login(user: UserI): Promise<boolean> {
    console.log('查找用户... ');
    return this.findByEmail(user.email)
      .then(async (data) => {
        return this.validatePassword(`${user.password}crypted`, data.password);
      })
      .catch((e) => {
        throw new HttpException(`用户不存在${e}`, HttpStatus.NOT_FOUND);
      });
  }

  private async findByEmail(email: string): Promise<UserI> {
    console.log('邮箱查找... ');
    return this.userRepository.findOne({
      where: { email: email },
      select: ['email', 'id', 'password', 'username'],
    });
  }

  private async validatePassword(
    password: string,
    storedPassword: string,
  ): Promise<any> {
    console.log('校验密码...');
    return password === storedPassword;
  }

  private async mailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email: email });
    if (user) {
      return true;
    } else {
      false;
    }
  }
}
