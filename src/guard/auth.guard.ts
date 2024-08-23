import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      //1) get token from header
      const token = request.headers.authorization.split(' ')[1];
      if (!token) {
        throw new ForbiddenException('Please provide access token');
      }

      // console.log('token: ', token);
      //2) jwt verify validate token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // find user in db
      // console.log('payload', payload);
      const user = await this.userService.findByEmail(payload.email);
      // console.log(user);
      if (!user) {
        throw new BadRequestException(
          'User not belong to token, please try again!',
        );
      }
      // assign user to request object
      request.currentUser = user;
      console.log('abc', request.currentUser);
    } catch (error) {
      throw new ForbiddenException('Invalid token or expire');
    }
    return true;
  }
}
