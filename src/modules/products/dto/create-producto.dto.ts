import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  IsInt,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la categoría a la que pertenece el producto',
  })
  categoryId?: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  name!: string;

  @IsNumber()
  @Min(0, { message: 'El precio del producto debe de ser mayor a 0' })
  @IsNotEmpty({ message: 'El precio del producto es obligatorio' })
  price!: number;

  @IsInt()
  @Min(0, { message: 'El stock del producto debe de ser mayor a 0' })
  @IsNotEmpty({ message: 'El stock del producto es obligatorio' })
  stock!: number;
}
