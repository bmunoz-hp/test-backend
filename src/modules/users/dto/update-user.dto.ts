import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

import {
  IsNotEmpty,
  IsString,
  Min,
  IsEmail,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  @Min(3, { message: 'Mínimo 3 caracteres' })
  fullName!: string;

  @IsEmail()
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email!: string;

  @IsString()
  @Min(6, { message: 'La contraseña debe de tener mínimo 6 caracteres' })
  password!: string;

  @IsUUID('4', { message: 'El roleId debe de ser un UUID válido' })
  @IsOptional()
  roleId?: string;
}
