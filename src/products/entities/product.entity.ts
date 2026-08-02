import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Check,
  CreateDateColumn, // Decorador para la fecha de creación
  UpdateDateColumn, // Decorador para la fecha de actualización
  Index, // Decorador para crear un índice en la base de datos, para buscar más rápido por el nombre del producto
} from 'typeorm';

@Index(['nombre']) // Acelera las busquedas por nombre del producto
@Entity('products')
@Check(`"precio" >= 0`) // Constraint para asegurar que el precio sea mayor o igual a 0
@Check(`"stock" >= 0`) // Constraint para asegurar que el stock sea mayor o igual a 0
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Constraints aplicados a la entidad Products
  /**
   * El campo nombre es obligatorio, único y no puede ser nulo. Se establece un límite de longitud de 100 caracteres para el nombre del producto.
   */
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  nombre!: string;
  // Default para evitar que el campo precio y stock sean nulos y para asegurar que tengan un valor inicial
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  precio!: number;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  /**
   * Campos para rastrear la fecha de creación y actualización del producto
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
