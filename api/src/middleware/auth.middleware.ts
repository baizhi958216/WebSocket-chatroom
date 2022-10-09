import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthService } from 'src/auth/service/auth.service';
import { UserI } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';

export interface RequestModule extends Request {
  user: UserI;
}

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async use(req: RequestModule, res: Response, next: NextFunction) {
    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ');
      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);
      const user: UserI = await this.userService.getOne(decodedToken.user.id);
      if (user) {
        // 修改客户端请求
        req.user = user;
        next();
      } else {
        throw new HttpException('找不到该用户', HttpStatus.UNAUTHORIZED);
      }
    } catch {
      throw new HttpException('未验证用户', HttpStatus.UNAUTHORIZED);
    }
  }
}
