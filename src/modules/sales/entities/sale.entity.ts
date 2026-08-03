import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { SaleDetail } from './sale-detail.entity';

export enum SaleStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
}

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  total!: number;

  @Column({ type: 'enum', enum: SaleStatus, default: SaleStatus.PENDING })
  status!: SaleStatus;

  @OneToMany(() => SaleDetail, (detail) => detail.sale, { cascade: true })
  details!: SaleDetail[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
