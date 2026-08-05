import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Role, RoleEnum } from '../users/entities/role.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registro de nuevo usuario (Sign-up) usando exclusivamente QueryBuilder
   */
  async signup(signupDto: SignupDto) {
    const { fullName, email, password } = signupDto;

    // 1. Verificar si el email ya existe con QueryBuilder
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email: email.trim() })
      .getOne();

    if (existingUser) {
      throw new BadRequestException(
        'El correo electrónico ya está registrado.',
      );
    }

    // 2. Buscar el rol por defecto (USER) con QueryBuilder
    const defaultRole = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.name = :name', { name: RoleEnum.USER })
      .getOne();

    if (!defaultRole) {
      throw new NotFoundException(
        `El rol por defecto "${RoleEnum.USER}" no está configurado en el sistema.`,
      );
    }

    // 3. Encriptar la contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insertar el usuario con QueryBuilder
    const insertUserResult = await this.userRepository
      .createQueryBuilder('user')
      .insert()
      .into(User)
      .values({
        fullName,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: { id: defaultRole.id },
      })
      .execute();

    const newUserId = insertUserResult.identifiers[0].id;

    // 5. Generar el JWT
    const token = this.generateJwtToken({
      id: newUserId,
      email: email.toLowerCase().trim(),
      role: defaultRole,
    } as User);

    return {
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUserId,
        fullName,
        email: email.toLowerCase().trim(),
        role: defaultRole.name,
      },
      accessToken: token,
    };
  }

  /**
   * Inicio de Sesión (Login)
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar al usuario incluyendo su rol e instanciando el campo oculto password (select: false)
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // Selecciona la contraseña explícitamente ya que en la entidad tiene select: false
      .leftJoinAndSelect('user.role', 'role')
      .where('LOWER(user.email) = LOWER(:email)', { email: email.trim() })
      .getOne();

    //  Validar existencia y estado del usuario (Mensaje genérico de seguridad para no revelar si el email existe)
    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'Credenciales incorrectas o usuario inactivo.',
      );
    }

    //  Comparar la contraseña en texto plano ingresada contra el hash encriptado guardado en la BD
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Credenciales incorrectas o usuario inactivo.',
      );
    }

    //  Generar el token de acceso JWT firmado
    const token = this.generateJwtToken(user);

    return {
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role?.name,
      },
      accessToken: token,
    };
  }

  /**
   * Método privado para firmar el Token JWT
   * Recibe el usuario recién registrado/autenticado y genera un token válido con su payload (id, email, role)
   */
  private generateJwtToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role?.name,
    };

    return this.jwtService.sign(payload);
  }
}
