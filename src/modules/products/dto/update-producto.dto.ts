import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-producto.dto';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
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
