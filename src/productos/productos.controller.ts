import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post('create')
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
  async create(
    @Body() createProductoDto: CreateProductoDto,
  ): Promise<CreateProductoDto> {
    return this.productosService.create(createProductoDto);
  }

  @Get('list')
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Productos obtenidos correctamente.',
    type: [ProductResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron productos.',
  })
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
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
    return this.productosService.findOne(id);
  }

  @Patch(':id')
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
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    const productoActualizado = await this.productosService.update(
      id,
      updateProductoDto,
    );
    return productoActualizado;
  }

  @Delete(':id')
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
    return this.productosService.remove(id);
  }
}
