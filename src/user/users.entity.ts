import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

enum ROLES {
  ADMIN = 'ADMIN',
  MOD = 'MOD',
  USER = 'USER',
}

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    type: 'text',
  })
  email: string;

  @Column({
    type: 'text',
  })
  @Exclude()
  password: string;

  @Exclude()
  @Column({ default: ROLES.USER })
  role: ROLES;
}
