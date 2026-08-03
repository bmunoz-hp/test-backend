import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@ApiTags('Ventas')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('create')
  @ApiOperation({ summary: 'Registrar una nueva venta y descontar stock' })
  @ApiResponse({
    status: 201,
    description: 'Venta registrada y stock actualizado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Stock insuficiente o datos de producto inválidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'Uno o más productos no fueron encontrados.',
  })
  async create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get('list')
  @ApiOperation({ summary: 'Obtener todas las ventas paginadas' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de ventas obtenida correctamente.',
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.salesService.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una venta por ID' })
  @ApiResponse({
    status: 200,
    description: 'Venta obtenida correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'ID de venta inválido (debe ser un UUID válido).',
  })
  @ApiResponse({
    status: 404,
    description: 'Venta no encontrada.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.salesService.findOne(id);
  }
}
