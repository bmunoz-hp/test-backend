import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Crear Venta usando QueryBuilder y Transacciones (QueryRunner)  
   */
  async create(
    createSaleDto: CreateSaleDto,
  ): Promise<{ message: string; id: string; total: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalSale = 0;

      //  Crear el registro de la Venta
      const insertSaleResult = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Sale)
        .values({ total: 0 })
        .execute();

      /** Obtiene el ID generado por la base de datos para este nuevo registro */
      const saleId = insertSaleResult.identifiers[0].id;

      // Procesar ítems, validar stock y descontar inventario
      for (const item of createSaleDto.items) {
        // Consultar el producto dentro de la transacción
        const product = await queryRunner.manager
          .createQueryBuilder(Product, 'product')
          .where('product.id = :id', { id: item.productId })
          .getOne();

        if (!product) {
          throw new NotFoundException(
            `El producto con ID ${item.productId} no existe`,
          );
        }

        // Validar Stock
        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Solicitado: ${item.quantity}`,
          );
        }

        // Descontar stock
        const newStock = product.stock - item.quantity;
        await queryRunner.manager
          .createQueryBuilder()
          .update(Product)
          .set({ stock: newStock })
          .where('id = :id', { id: product.id })
          .execute();

        // Calcular subTotal
        const subTotal = Number(product.price) * item.quantity;
        totalSale += subTotal;

        // Insertar el detalle de la venta
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(SaleDetail)
          .values({
            sale: { id: saleId },
            product: { id: product.id },
            quantity: item.quantity,
            unitPrice: product.price,
            subTotal,
          })
          .execute();
      }

      //  Actualizar el total definitivo de la venta
      await queryRunner.manager
        .createQueryBuilder()
        .update(Sale)
        .set({ total: totalSale })
        .where('id = :id', { id: saleId })
        .execute();

      // Confirmar transacción
      await queryRunner.commitTransaction();

      return {
        message: 'Venta registrada y stock actualizado correctamente',
        id: saleId,
        total: totalSale,
      };
    } catch (error) {
      // Si algo falla, revertir todo (ROLLBACK)
      await queryRunner.rollbackTransaction();
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Error al procesar la venta',
        error instanceof Error ? error.message : 'Error desconocido',
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Obtener todas las ventas paginadas con QueryBuilder y leftJoinAndSelect  
   */
  async findAll(page = 1, limit = 10) {
    const query = this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.details', 'details')
      .leftJoinAndSelect('details.product', 'product');

    const [sales, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('sale.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: sales,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  /**
   * Obtener una venta por ID
   */
  async findOne(id: string): Promise<Sale> {
    const sale = await this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.details', 'details')
      .leftJoinAndSelect('details.product', 'product')
      .where('sale.id = :id', { id: id.trim() })
      .getOne();

    if (!sale) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return sale;
  }
}
