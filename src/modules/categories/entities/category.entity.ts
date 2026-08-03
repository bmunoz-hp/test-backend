import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Esta es la relacion entre Category y Product, donde un Category puede tener muchos Products
  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
