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

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear un producto' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado correctamente',
    type: CreateProductoDto,
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
    description: 'Productos obtenidos corretamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error interno del servidor.',
  })
  @ApiResponse({
    status: 404,
    description: 'Productos solicitados no encontrado. ',
  })
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por su ID.' })
  @ApiResponse({
    status: 200,
    description: 'Producto obtenido correctamente.',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error interno del servidor.',
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
    type: UpdateProductoDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
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
  remove(@Param('id') id: string) {
    return this.productosService.remove(id);
  }
}
