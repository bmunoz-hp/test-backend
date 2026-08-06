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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RoleEnum } from './entities/role.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserResposeDto } from './dto/user-response.dto';

@ApiTags('Usuarios')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente',
    type: UserResposeDto,
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
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios paginados.' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Usuarios obtenidos correctamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron usuarios',
  })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.usersService.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID.' })
  @ApiResponse({
    status: 200,
    description: 'Usuario obtenido correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'ID de usuario inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el usuario',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente.',
    type: UserResposeDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de actualización o ID inválidos',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario a actualizar no encontrado.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor al actualizar el prroveedor.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userUpdate = await this.usersService.update(id, updateUserDto);

    return userUpdate;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'ID del usuario inválido.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario a eliminar no encontrado.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor al actualizar el prroveedor.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
