import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleDetail])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
