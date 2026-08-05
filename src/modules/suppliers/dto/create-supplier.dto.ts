import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Min,
  IsEmail,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Proveedor ABC SAS',
    description: 'El nombre o razón social del proveedor',
  })
  name!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: ' ID del tipo de documento',
  })
  docType!: string;

  @IsString()
  @IsNotEmpty({ message: 'Número de documento obligatorio' })
  @Min(8, { message: 'El documento debe de tener mínimo 8 caracteres' })
  numDoc!: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    example: 'compras@example.com',
  })
  email!: string;

  @IsOptional()
  @IsString()
  @Min(7, { message: 'Mínimo 7 caracteres' })
  @ApiProperty({
    example: '300123456',
  })
  phone!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Calle 91d #66-9',
  })
  address!: string;

  @IsOptional()
  @IsString()
  @Min(5, { message: 'Mínimo 5 caracteres' })
  @ApiProperty({
    example: 'Descripción sobre el proveedor',
  })
  description!: string;
}
