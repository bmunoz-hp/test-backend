import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleEnum } from '../users/entities/role.entity';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@ApiTags('Ventas')
@Controller('sales')
// @UseGuards(AuthGuard('jwt'), RolesGuard) //Se aplica jwt + roles a todo el controlador
// @Roles(RoleEnum.ADMIN, RoleEnum.SELLER) //Solo ADMIN y SELLER pueden usar el modulo
export class SalesController {
  /**Todos los metodos dentro del controlador quedan protegidos */
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) // <-- Protege sólo este endpoint
  @Roles(RoleEnum.ADMIN, RoleEnum.SELLER)
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

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.SELLER, RoleEnum.USER)
  @ApiOperation({ summary: 'Obtener todas las ventas paginadas' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de ventas obtenida correctamente.',
  })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.salesService.findAll(+page, +limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.SELLER, RoleEnum.USER)
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

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Cambiar el estado de una venta' })
  @ApiResponse({
    status: 200,
    description: 'Estado de la venta actualizado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'ID de venta inválido o estado no permitido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Venta no encontrada.',
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSaleDto: UpdateSaleDto,
  ) {
    return this.salesService.updateStatus(id, updateSaleDto);
  }
}
