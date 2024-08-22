import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from "class-transformer";

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    type: 'text',
  })
  username: string;

  @Column({
    type: 'text',
  })
  @Exclude()
  password: string;
}
