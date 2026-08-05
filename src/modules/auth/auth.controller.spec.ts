import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signup: jest.fn().mockImplementation((dto: SignupDto) =>
      Promise.resolve({
        message: 'Usuario registrado exitosamente',
        user: { id: 'uuid-1', fullName: dto.fullName, email: dto.email, role: 'USER' },
        accessToken: 'jwt-token-token',
      }),
    ),
    login: jest.fn().mockImplementation((dto: LoginDto) =>
      Promise.resolve({
        message: 'Inicio de sesión exitoso',
        user: { id: 'uuid-1', fullName: 'Test', email: dto.email, role: 'USER' },
        accessToken: 'jwt-token-token',
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería registrar un usuario (signup)', async () => {
    const dto: SignupDto = {
      fullName: 'Juan Perez',
      email: 'juan@test.com',
      password: 'password123',
    };
    const result = await controller.signup(dto);
    expect(result).toHaveProperty('accessToken');
    expect(result.user.email).toBe('juan@test.com');
  });

  it('debería iniciar sesión (login)', async () => {
    const dto: LoginDto = {
      email: 'juan@test.com',
      password: 'password123',
    };
    const result = await controller.login(dto);
    expect(result).toHaveProperty('accessToken');
    expect(result.message).toBe('Inicio de sesión exitoso');
  });
});
