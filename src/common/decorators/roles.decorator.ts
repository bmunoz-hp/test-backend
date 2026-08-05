import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/modules/users/entities/role.entity';

// Clave unica para almacenar la metadata de los roles requeridos
export const ROLES_KEY = 'roles';

/**
 * Decorador para restringir el acceso a los endpoints por ROl
 * Uso: @Roles(RoleEnum.ADMIN, RoleEnum.SELLER)
 */

export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
