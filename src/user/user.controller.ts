import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser(): Promise<Users[]> {
    return await this.userService.getAllUser();
  }

  @Post()
  async create(@Body() userDto: CreateUserDto): Promise<Users> {
    return await this.userService.create(userDto);
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
}
