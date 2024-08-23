import { Users } from '../user/users.entity';
import { BadRequestException } from '@nestjs/common';

export class Permission {
  static check(id: number, currentUser: Users) {
    if (id === currentUser.id) return;
    if (currentUser.role === 'ADMIN') return;

    throw new BadRequestException('User can not permission action');
  }
}
