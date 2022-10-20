import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UserI } from '../model/user.interface';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserService } from '../service/user-service/user-service.service';

@Controller('user')
export class UserController {
  constructor(
    private userHelperService: UserHelperService,
    private userService: UserService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserI> {
    console.log(createUserDto);
    const userEntity: UserI =
      await this.userHelperService.createUserDtoToEntity(createUserDto);

    return this.userService.create(userEntity);
  }
}
