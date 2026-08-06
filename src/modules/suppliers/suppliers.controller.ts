import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RoleEnum } from '../users/entities/role.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { SupplierResponseDto } from './dto/supplier-response.dto';

@ApiTags('Proveedores')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.ADMIN)
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiResponse({
    status: 201,
    description: 'Proveedor creado correctamente',
    type: SupplierResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o duplicados',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado (Falta token JWT)',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los proveedores paginados' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Proveedores obtenidos correctamente',
    type: [SupplierResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron proveedores',
  })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.suppliersService.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proveedor por ID' })
  @ApiResponse({
    status: 200,
    description: 'Proveedor obtenido correctamente',
    type: SupplierResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ' ID inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Proveedor solicitado no encontrado',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.suppliersService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Proveedor actualizado correctamente.',
    type: SupplierResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de actualización o ID inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Proveedor a actualizar no encontrado.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor al actualizar el prroveedor.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    const productUpdted = await this.suppliersService.update(
      id,
      updateSupplierDto,
    );
    return productUpdted;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un proveedor por ID' })
  @ApiResponse({
    status: 200,
    description: 'Proveedor eliminado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'ID de proveedor inválido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Proveedor a eliminar no encontrado.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.suppliersService.remove(id);
  }
}
