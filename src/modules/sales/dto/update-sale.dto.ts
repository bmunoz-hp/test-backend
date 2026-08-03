import { PartialType } from '@nestjs/swagger';
import { CreateSaleDto } from './create-sale.dto';
import { SaleStatus } from '../entities/sale.entity';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @IsNotEmpty({ message: 'El estado es requerido.' })
  @IsEnum(SaleStatus, {
    message: 'El estado debe de ser: pendiente, completado o cancelado.',
  })
  status!: SaleStatus;
}
