import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ message: string; id: string }> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .insert()
      .into(Category)
      .values(createCategoryDto)
      .execute();

    /** Obtiene el ID generado por la base de datos para este nuevo registro */
    const generatedId = category.identifiers[0].id;

    return {
      message: 'Categoría creada correctamente',
      id: generatedId,
    };
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'product'); // Se hace un left join con la tabla products para obtener los productos asociados a la categoría

    if (search) {
      category.where('LOWER(category.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    const [categories, total] = await category
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('category.name', 'ASC')
      .getManyAndCount();

    return {
      data: categories,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'product') // Se hace un left join con la tabla products para obtener los productos asociados a la categoría
      .where('category.id = :id', { id })
      .getOne();

    if (!category) {
      throw new Error(`Categoría con id ${id} no encontrada`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .update(Category)
      .set(updateCategoryDto)
      .where('id = :id', { id })
      .execute();

    if (category.affected === 0) {
      throw new Error(`Categoría con id ${id} no encontrada`);
    }

    return {
      message: `Categoría con id ${id} actualizada correctamente`,
    };
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.categoryRepository
      .createQueryBuilder('category')
      .delete()
      .from(Category)
      .where('id = :id', { id })
      .execute();
  }
}
