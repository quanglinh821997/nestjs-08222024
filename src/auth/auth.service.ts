import { BadRequestException, Injectable, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../user/dto/registerUser.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import * as process from 'node:process';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async registerUser(registerUSerDto: RegisterUserDto) {
    // check email is exist
    const findByEmai = await this.userService.findByEmail(
      registerUSerDto.email,
    );
    if (findByEmai) {
      throw new BadRequestException('Username already exist!');
    }

    //hash password
    const hashPassword = await bcrypt.hash(registerUSerDto.password, 10);

    registerUSerDto.password = hashPassword;

    // save to db
    const savedUer = await this.userService.create(registerUSerDto);

    // generate jwt token
    const payload = {
      id: savedUer.id,
      email: savedUer.email,
      role: savedUer.role,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      msg: 'User has been created!',
      access_token,
    };
  }

  async login(loginDto: LoginDto) {
    // check user exists
    const findUser = await this.userService.findByEmail(loginDto.email);
    if (!findUser) {
      throw new BadRequestException('Invalid Credentials!');
    }
    // check password
    const isMatchPassword = await bcrypt.compare(
      loginDto.password,
      findUser.password,
    );
    if (!isMatchPassword) {
      throw new BadRequestException('Invalid Credentials!');
    }
    // generate jwt token
    const payload = {
      id: findUser.id,
      email: findUser.email,
      role: findUser.role,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      msg: 'User has been login success!',
      access_token,
    };
  }

  async getCurrentUser(@Request() req) {
    return await req.current;
  }
}
