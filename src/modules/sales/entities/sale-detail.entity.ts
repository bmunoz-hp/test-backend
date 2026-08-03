import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('sale_details')
export class SaleDetail {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  subTotal!: number;

  // Relación con la entidad Sale
  @ManyToOne(() => Sale, (sale) => sale.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'saleId' })
  sale!: Sale;

  // Relación con la entidad Product
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product!: Product;
}
