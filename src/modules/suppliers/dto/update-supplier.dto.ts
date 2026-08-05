import { PartialType } from '@nestjs/swagger';
import { CreateSupplierDto } from './create-supplier.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Min,
  IsEmail,
  Length,
} from 'class-validator';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del proveedor es obliatorio' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Tipo de documento obligatorio' })
  docType!: string;

  @IsString()
  @IsNotEmpty({ message: 'Número de documento obligatorio' })
  numDoc!: string;

  @IsEmail()
  @IsOptional()
  email!: string;

  @IsOptional()
  @IsString()
  @Min(7, {
    message: 'El número de celular debe de tener minimo 7 caracteres',
  })
  phone!: string;

  @IsOptional()
  @IsString()
  address!: string;

  @IsOptional()
  @IsString()
  @Min(5, { message: 'Mínimo 5 caracteres' })
  description!: string;
}
