import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleItemDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del producto',
  })
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({
    example: 2,
    description: 'Cantidad de productos a comprar',
  })
  @IsInt()
  @IsPositive()
  @Min(1, { message: 'La cantidad debe de ser al menos 1' })
  quantity!: number;
}

// Esta clase crea la venta con el array de items
export class CreateSaleDto {
  @ApiProperty({
    type: [CreateSaleDto],
    description: 'Lista de productos de la venta',
  })
  @IsArray()
  // Valida que cada elemento del arreglo cumpla con las reglas definidas en CreateSaleItemDto
  @ValidateNested({ each: true })
  // Transforma los datos JSON entrantes en instancias reales de la clase CreateSaleItemDto
  @Type(() => CreateSaleItemDto)
  items!: CreateSaleItemDto[];
}
