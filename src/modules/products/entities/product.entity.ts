import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Check,
  CreateDateColumn, // Decorador para la fecha de creación
  UpdateDateColumn, // Decorador para la fecha de actualización
  Index, // Decorador para crear un índice en la base de datos, para buscar más rápido por el nombre del producto
  ManyToOne,
  JoinColumn, // Decorador para establecer la relación entre Product y Category
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Index(['name']) // Acelera las busquedas por nombre del producto
@Entity('products')
@Check(`"price" >= 0`) // Constraint para asegurar que el precio sea mayor o igual a 0
@Check(`"stock" >= 0`) // Constraint para asegurar que el stock sea mayor o igual a 0
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Constraints aplicados a la entidad Products
  /**
   * El campo nombre es obligatorio, único y no puede ser nulo. Se establece un límite de longitud de 100 caracteres para el nombre del producto.
   */
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name!: string;
  // Default para evitar que el campo precio y stock sean nulos y para asegurar que tengan un valor initial
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  price!: number;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  // La columna de categoryId es opcional, ya que un producto puede no estar asociado a una categoría. Se establece como nullable para permitir que sea nulo en la base de datos.
  @Column({ name: 'categoryId', type: 'uuid', nullable: true })
  categoryId?: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL', // Si la categoría es eliminada, el campo categoryId del producto se establecerá en NULL
    nullable: true, // Permite que el campo categoryId sea nulo
    eager: true, // Carga la categoría asociada al producto de manera inmediata
  })

  // Relación entre Product y Category, donde un Product pertenece a una Category. Se establece la columna categoryId en la tabla products para almacenar la relación con la tabla categories. Se utiliza el decorador @JoinColumn para indicar que esta columna es la que establece la relación entre ambas tablas.
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  /**
   * Campos para rastrear la fecha de creación y actualización del producto
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
