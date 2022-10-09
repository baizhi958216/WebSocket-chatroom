import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/model/user.entity';
import { UserI } from 'src/user/model/user.interface';

import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
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
    return this.authService.hashPassword(password);
  }

  private async findOne(id: number): Promise<UserI> {
    return this.userRepository.findOneBy({
      id: id,
    });
  }

  public getOne(id: number): Promise<UserI> {
    return this.userRepository.findOneByOrFail({ id: id });
  }

  async login(user: UserI): Promise<string> {
    console.log('查找用户... ');
    try {
      const foundUser: UserI = await this.findByEmail(user.email.toLowerCase());
      if (foundUser) {
        console.log('用户已找到, 准备校验密码...');
        const matches: boolean = await this.validatePassword(
          user.password,
          foundUser.password,
        );
        if (matches) {
          console.log('密码校验成功, 生成JWT令牌');
          const payload: UserI = await this.findOne(foundUser.id);
          return this.authService.generateJwt(payload);
        } else {
          throw new HttpException('用户名或密码错误', HttpStatus.UNAUTHORIZED);
        }
      } else {
        throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
      }
    } catch {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
  }

  private async findByEmail(email: string): Promise<UserI> {
    console.log('邮箱查找... ', email);
    return await this.userRepository.findOne({
      where: { email: email },
      select: ['email', 'id', 'password', 'username'],
    });
  }

  private async validatePassword(
    password: string,
    storedPassword: string,
  ): Promise<boolean> {
    return this.authService.comparePassword(password, storedPassword);
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
