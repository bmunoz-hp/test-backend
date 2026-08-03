import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoriesModule, //Importa el modulo de categorias para poder usarlo en el modulo de productos, ya que se necesita para la relacion entre Product y Category
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
