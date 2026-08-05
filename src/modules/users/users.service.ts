import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role, RoleEnum } from './entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; id: string }> {
    const { fullName, email, password, roleId } = createUserDto;
    try {
      // Verificar si el email ya está registrado
      const existingEmail = await this.userRepository
        .createQueryBuilder('user')
        .where('LOWER(user.email) = LOWER(:email)', { email: email.trim() })
        .getOne();

      if (existingEmail) {
        throw new BadRequestException('El correo ya está registrado.');
      }
      // Se determina el rol a asignar
      let targetRoleId = roleId;

      if (targetRoleId) {
        // Si el admin envia un roleId, se valida que ese ID exista
        const roleExist = await this.roleRepository
          .createQueryBuilder('role')
          .where('role.id = :id', { id: targetRoleId })
          .getOne();

        if (!roleExist) {
          throw new NotFoundException(
            `El rol con ID ${targetRoleId} no existe.`,
          );
        }
      } else {
        // Si el admin no envia un roleId, se le asigna 'USER' por defecto
        const defaultRole = await this.roleRepository
          .createQueryBuilder('role')
          .where('role.name = :name', { name: RoleEnum.USER })
          .getOne();

        if (!defaultRole) {
          throw new NotFoundException(
            `El rol por defecto '${RoleEnum.USER}' no está configurado en el sistema.`,
          );
        }
        targetRoleId = defaultRole.id;
      }

      // Encriptar la contraseña con bcrypt antes de guardar
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar el usuario
      const insertResult = await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          fullName,
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: { id: targetRoleId },
        })
        .execute();

      const generatedId = insertResult.identifiers[0].id;

      return {
        message: 'Usuario creado correctamente',
        id: generatedId,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      // Si es un error desconocido de BD, devolvemos BadRequestException
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException('Error al crear el usuario', errorMessage);
    }
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const user = await this.userRepository.createQueryBuilder('user');

    if (search) {
      user.where('LOWER(user.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    const [users, total] = await user
      .skip(page - 1 * limit)
      .take(limit)
      .orderBy('user.name', 'ASC')
      .getManyAndCount();

    return {
      data: users,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .update(User)
      .set(updateUserDto)
      .where('user.id = :id', { id })
      .execute();

    if (user.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return {
      message: `Usuario con ID ${id} actualizado correctamente.`,
    };
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.userRepository
      .createQueryBuilder('user')
      .delete()
      .where('user.id = :id', { id })
      .execute();
  }
}
