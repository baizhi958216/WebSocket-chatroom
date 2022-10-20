import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/model/dto/create-user.dto';
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class UserHelperService {
  async createUserDtoToEntity(createUserDto: CreateUserDto): Promise<UserI> {
    return {
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password,
    };
  }
}
