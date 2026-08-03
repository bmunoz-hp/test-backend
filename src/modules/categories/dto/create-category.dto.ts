import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Electrónica',
    description: 'Nombre único de la categoría',
    maxLength: 100,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name!: string;

  @ApiPropertyOptional({
    example: 'Dispositivos y accesorios electrónicos',
    description: 'Descripción opcional de la categoría',
    maxLength: 255,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(255, { message: 'La descripción no puede exceder 255 caracteres' })
  description?: string;
}
