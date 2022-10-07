import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { LoginUserDto } from '../model/dto/login-user.dto';
import { UserI } from '../model/user.interface';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserService } from '../service/user-service/user.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserI> {
    const userEntity: UserI =
      this.userHelperService.createUserDtoToEntity(createUserDto);
    return this.userService.create(userEntity);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<UserI>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/api/users',
    });
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<boolean> {
    const userEntity =
      this.userHelperService.loginUserDtoToEntity(loginUserDto);
    return this.userService.login(userEntity);
  }
}
