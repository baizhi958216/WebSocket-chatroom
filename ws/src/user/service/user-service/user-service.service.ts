import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/model/user.entity';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepositroy: Repository<UserEntity>,
  ) {}

  // 新建用户
  async create(newUser: UserI): Promise<UserI> {
    console.log('newUser is: ', newUser);

    const user = await this.userRepositroy.save(
      this.userRepositroy.create(newUser),
    );
    return this.findOne(user.id);
  }

  // 通过id查找用户
  private async findOne(id: number): Promise<UserI> {
    console.log('Id is: ', id);

    return this.userRepositroy.findOneBy({
      id: id,
    });
  }
}
