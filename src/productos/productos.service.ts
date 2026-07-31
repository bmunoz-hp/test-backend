import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { throwError } from 'rxjs';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  /**
   * Cambiar consultar a BD por QueryBuilder
   * Validar ID antes de hacer la Query (UUID)
   * Aplicar Constraints en la entidad Productos
   * */

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const nuevoProducto = this.productoRepository.create(createProductoDto);
    if (!nuevoProducto) {
      // Mejorar excepciones de respuesta
      throw new NotFoundException('Error al crear producto');
    }
    return await this.productoRepository.save(nuevoProducto);
  }

  async findAll(): Promise<Producto[]> {
    if (!Producto) {
      throw new NotFoundException('Productos no encontrados');
    }
    // Aplicar filtros de busqueda, paginación y ordenamiento
    return await this.productoRepository.find();
  }

  async findOne(id: string): Promise<Producto | null> {
    if (!id) {
      // Mejorar excepciones de respuesta
      throw new NotFoundException('El ID del producto no existe.');
    }
    return await this.productoRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto | null> {
    const producto = await this.findOne(id);
    if (!producto) {
      // Mejorar excepciones de respuesta
      throw new NotFoundException('Producto no encontrado');
    }
    this.productoRepository.merge(producto, updateProductoDto);
    return await this.productoRepository.save(producto);
  }

  async remove(id: string): Promise<void> {
    const producto = await this.findOne(id);
    if (!producto) {
      // Mejorar excepciones de respuesta
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    await this.productoRepository.remove(producto);
  }
}
