import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

export enum RoleEnum {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
  USER = 'USER',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    unique: true,
    default: RoleEnum.USER,
  })
  name!: RoleEnum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}
