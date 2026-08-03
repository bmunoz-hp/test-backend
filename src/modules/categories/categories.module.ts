import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // Importa el módulo TypeOrmModule y registra la entidad Category para que pueda ser utilizada en el módulo de categorías
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService, TypeOrmModule], // Exporta el servicio de categorías y el módulo TypeOrmModule para que puedan ser utilizados en otros módulos
})
export class CategoriesModule {}
