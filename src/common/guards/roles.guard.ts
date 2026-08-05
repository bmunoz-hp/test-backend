import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleEnum } from 'src/modules/users/entities/role.entity';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos especificados en el decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    //   Si el endpoint no requiere roles especificos, se permite el acceso
    if (!requiredRoles) {
      return true;
    }

    // Obtener el usuario autenticado desde el objeto request (inyectado por JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException(
        'No tienes permisos suficientes para realizar esta acción',
      );
    }

    // Validar si el rol del  usuario esta dentro de los roles permitidos

    const hasRole = requiredRoles.includes(user.role.name);

    if (!hasRole) {
      throw new ForbiddenException(
        `Acceso denegado. Se requiere el rol: [${requiredRoles.join(', ')}]`,
      );
    }
    return true;
  }
}
