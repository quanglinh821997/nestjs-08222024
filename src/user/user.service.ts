import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/registerUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async getAllUser(): Promise<Users[]> {
    return await this.userRepository.find();
  }

  async create(userDto: RegisterUserDto): Promise<Users> {
    const createUSer = await this.userRepository.create(userDto);
    return await this.userRepository.save(createUSer);
  }

  async update(id: number, userDto: UpdateUserDto): Promise<Users> {
    let foundUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!foundUser) {
      throw new HttpException(
        `User with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    foundUser = { ...foundUser, ...userDto };
    return await this.userRepository.save(foundUser);
  }

  async getUserById(id: number): Promise<Users> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (err) {
      throw new HttpException(
        `User with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async delete(id: number): Promise<number> {
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!foundUser) {
      throw new HttpException(
        `User with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userRepository.delete(foundUser);
    return foundUser.id;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email: email });
  }
}
