import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({ example: 'Laptop Pro' })
  name!: string;

  @ApiProperty({ example: 1200.5 })
  price!: number;
}
