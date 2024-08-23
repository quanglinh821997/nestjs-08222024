import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { AuthGuard } from '../guard/auth.guard';
import { RegisterUserDto } from './dto/registerUser.dto';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from '../auth/dto/login.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LoggingInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // requets -> middleware -> guard -> interceptor -> response
  @Get()
  @UseGuards(AuthGuard)
  async getAllUser(): Promise<Users[]> {
    console.log('Second');
    return await this.userService.getAllUser();
  }

  @Put(':id')
  async update(
    @Param() id: number,
    @Body() updateDto: UpdateUserDto,
  ): Promise<Users> {
    return await this.userService.update(id, updateDto);
  }

  @Get(':id')
  async getUserById(@Param() id: number): Promise<Users> {
    return await this.userService.getUserById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<number> {
    return await this.userService.delete(id);
  }

  @Post('/register')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.registerUser(registerUserDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
