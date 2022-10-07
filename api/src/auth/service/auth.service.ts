import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(user: UserI): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  async hashPassword(password: string): Promise<string> {
    return `${password}crypted`;
  }

  async comparePassword(
    password: string,
    storedPassword: string,
  ): Promise<any> {
    console.log('校验密码...');
    return `${password}crypted` === storedPassword;
  }
}
