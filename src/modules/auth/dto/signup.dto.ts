import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    example: 'Juan Perez',
    description: 'Nombre completo del usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  fullName!: string;

  @ApiProperty({
    example: 'juan@correo.com',
    description: 'Email  único del usuario',
  })
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña segura (mínimo 6 caracteres)',
  })
  @IsString()
  @MinLength(6, {
    message: 'La contraseña debe de tener al menos 6 caracteres',
  })
  password!: string;
}
