import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-producto.dto';
import { UpdateProductDto } from './dto/update-producto.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Cambiar consultar a BD por QueryBuilder
   * Validar ID antes de hacer la Query (UUID)
   * Aplicar Constraints en la entidad products
   * */

  async create(
    createproductDto: CreateProductDto,
  ): Promise<{ message: string; id: string }> {
    try {
      const query = await this.productRepository
        .createQueryBuilder('product')
        .insert()
        .into(Product)
        .values(createproductDto)
        .execute();

      const generatedId = query.identifiers[0].id;

      return {
        message: 'Producto creado correctamente',
        id: generatedId,
      };
    } catch (error) {
      // Se captura el error y se lanza una excepción con un mensaje más amigable (primera vez aplicando estas practicas)
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException('Error al crear el producto', errorMessage);
    }
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category'); // Se hace un left join con la tabla categories para obtener la categoría asociada al producto

    // Si se proporciona un término de búsqueda, se filtra por nombre del producto
    if (search) {
      query.where('LOWER(product.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    // Se aplica la paginación y se ordena por nombre del producto
    const [products, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.name', 'ASC')
      .getManyAndCount();

    // Se devuelve un objeto con los productos, el total de productos, la página actual y la última página
    return {
      data: products,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category') // Se hace un left join con la tabla categories para obtener la categoría asociada al producto
      .where('product.id = :id', { id })
      .getOne();

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async update(id: string, updateproductDto: UpdateProductDto) {
    const query = await this.productRepository
      .createQueryBuilder('product')
      .update(Product)
      .set(updateproductDto)
      .where('id = :id', { id })
      .execute();

    // Se valida con el affected si se actualizo el producto, si no se actualizo se lanza una excepcion
    if (query.affected === 0) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return { message: `Producto con ID ${id} actualizado correctamente` };
  }

  async remove(id: string): Promise<void> {
    // Validar que el producto exista antes de eliminarlo
    await this.findOne(id);

    // Eliminar el producto
    await this.productRepository
      .createQueryBuilder('product')
      .delete()
      .from(Product)
      .where('product.id = :id', { id })
      .execute();
  }
}
