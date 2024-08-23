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
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { AuthGuard } from '../guard/auth.guard';
import { RegisterUserDto } from './dto/registerUser.dto';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from '../auth/dto/login.dto';
import { CurrentUser } from './decorators/currentUser.decorators';
import { RoleGuard } from '../guard/role.guard';

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
  @UseGuards(new RoleGuard(['user', 'admin']))
  @UseGuards(AuthGuard)
  async getAllUser(): Promise<Users[]> {
    return await this.userService.getAllUser();
  }

  @Put('/update/:id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto,
    @CurrentUser() currentUser: Users,
  ): Promise<Users> {
    return await this.userService.update(id, updateDto, currentUser);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<Users> {
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

  @Get('/detail/current-user')
  @UseGuards(AuthGuard)
  @UseGuards(new RoleGuard(['admin']))
  getUser(@CurrentUser() currentUser): Promise<Users> {
    console.log('currentUser: ', currentUser);
    return currentUser;
  }
}
