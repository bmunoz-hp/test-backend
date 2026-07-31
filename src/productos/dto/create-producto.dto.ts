import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
  IsInt,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  nombre!: string;

  @IsNumber()
  @Min(0, { message: 'El precio del producto debe de ser mayor a 0' })
  @IsNotEmpty({ message: 'El precio del producto es obligatorio' })
  precio!: number;

  @IsInt()
  @Min(0, { message: 'El stock del producto debe de ser mayor a 0' })
  @IsNotEmpty({ message: 'El stock del producto es obligatorio' })
  stock!: number;
}
