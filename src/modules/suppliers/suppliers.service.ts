import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(
    createsupplierDto: CreateSupplierDto,
  ): Promise<{ message: string; id: string }> {
    try {
      const supplier = await this.supplierRepository
        .createQueryBuilder('supplier')
        .insert()
        .into(Supplier)
        .values(createsupplierDto)
        .execute();

      const generatedId = supplier.identifiers[0].id;

      return {
        message: 'Proveedor creado correctamente',
        id: generatedId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException('Error al crear el producto', errorMessage);
    }
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const supplier = this.supplierRepository.createQueryBuilder('supplier');

    if (search) {
      supplier.where('LOWER(supplier.name) LIKE LOWER(:search', {
        search: `%${search}%`,
      });
    }

    const [suppliers, total] = await supplier
      .skip(page - 1 * limit)
      .take(limit)
      .orderBy('supplier.name', 'ASC')
      .getManyAndCount();

    return {
      data: suppliers,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository
      .createQueryBuilder('supplier')
      .where('supplier.id = :id', { id })
      .getOne();

    if (!supplier) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }
    return supplier;
  }

  async update(id: string, updatesupplierDto: UpdateSupplierDto) {
    const supplier = await this.supplierRepository
      .createQueryBuilder('supplier')
      .update(Supplier)
      .set(updatesupplierDto)
      .where('id = :id', { id })
      .execute();

    if (supplier.affected === 0) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado.`);
    }

    return { message: `Proveedor con ID ${id} actualizado correctamente.` };
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.supplierRepository
      .createQueryBuilder('supplier')
      .delete()
      .from(Supplier)
      .where('supplier.id = :id', { id })
      .execute();
  }
}
