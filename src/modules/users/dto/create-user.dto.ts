import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Min(3, { message: 'Mínimo 3 caracteres' })
  @ApiProperty({
    example: 'Juan Perez',
    description: 'Ingresar el nombre completo del usuario',
  })
  fullName!: string;

  @IsEmail()
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @ApiProperty({
    example: 'user@example.com',
    description: 'Ingresar el correo electronico del usuario',
  })
  email!: string;

  @IsString()
  @Min(6, { message: 'La contraseña debe de tener mínimo 6 caracteres' })
  @ApiProperty({ example: '123456', description: 'Contraseña del usuario' })
  password!: string;

  @IsUUID('4', { message: 'El roleId debe de ser un UUID válido' })
  @IsOptional()
  //   Se coloca opcional, ya que si el admin no selecciona un roleId, se coloca el por default del servicio
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del rol asignado al usuario (Opcional)',
  })
  roleId?: string;
}
