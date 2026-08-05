import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Check,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
  JoinColumn,
} from 'typeorm';

export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name!: string;

  //   Relacion proxima con la tabla de tipos de documentos.
  @ManyToMany(() => DocumentType)
  @JoinColumn({ name: 'doc_type_id' })
  docType!: DocumentType;

  @Column({ type: 'varchar', length: 10, unique: true, nullable: false })
  numDoc!: string;

  @Column({ type: 'varchar', length: 40, unique: true, nullable: true })
  email!: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  address!: string;

  @Column({ type: 'text', length: 255, nullable: true })
  description!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
