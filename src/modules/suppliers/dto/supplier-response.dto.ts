import { ApiProperty } from '@nestjs/swagger';

export class SupplierResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({ example: 'Proveedor ABC SAS' })
  name!: string;

  @ApiProperty({ example: 'compras@example.com' })
  email!: string;

  @ApiProperty({ example: 'Calle 10 #20-30' })
  address!: string;

  @ApiProperty({ example: '3001234567' })
  phone!: string;

  @ApiProperty({ example: 'Descripción del proveedor' })
  description!: string;
}
