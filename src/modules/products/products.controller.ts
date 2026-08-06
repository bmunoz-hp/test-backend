import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RoleEnum } from '../users/entities/role.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-producto.dto';
import { UpdateProductDto } from './dto/update-producto.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado correctamente',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Campos faltantes o datos inválidos',
  })

  // Corregido para recibir el DTO de creación de producto y devolver un objeto con mensaje e ID
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<{ message: string; id: string }> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.SELLER, RoleEnum.USER)
  @ApiOperation({ summary: 'Obtener todos los productos paginados' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Productos obtenidos correctamente.',
    type: [ProductResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron productos.',
  })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    (RoleEnum.SELLER, RoleEnum.USER);
    return this.productsService.findAll(+page, +limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.SELLER, RoleEnum.USER)
  @ApiOperation({ summary: 'Obtener un producto por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Producto obtenido correctamente.',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido (debe ser un UUID válido).',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto solicitado no encontrado.',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductResponseDto | null> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Actualizar un producto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado correctamente.',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de actualización o ID inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto a actualizar no encontrado.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor al actualizar el producto.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const productUpdated = await this.productsService.update(
      id,
      updateProductDto,
    );
    return productUpdated;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Eliminar un producto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Producto eliminado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'ID de producto inválido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto a eliminar no encontrado.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
