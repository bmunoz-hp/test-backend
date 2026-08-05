import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Role, RoleEnum } from '../users/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockQueryBuilderUser = {
    where: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ identifiers: [{ id: 'user-uuid-1' }] }),
    getOne: jest.fn(),
  };

  const mockQueryBuilderRole = {
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockUserRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilderUser),
  };

  const mockRoleRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilderRole),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('debería registrar un nuevo usuario exitosamente', async () => {
      mockQueryBuilderUser.getOne.mockResolvedValueOnce(null); // No existe usuario
      mockQueryBuilderRole.getOne.mockResolvedValueOnce({ id: 'role-uuid-1', name: RoleEnum.USER });

      const dto = { fullName: 'Juan', email: 'juan@test.com', password: '123' };
      const result = await service.signup(dto);

      expect(result).toHaveProperty('accessToken', 'mocked-jwt-token');
      expect(result.message).toBe('Usuario registrado exitosamente');
    });

    it('debería lanzar BadRequestException si el email ya existe', async () => {
      mockQueryBuilderUser.getOne.mockResolvedValueOnce({ id: 'existing-id' });

      const dto = { fullName: 'Juan', email: 'juan@test.com', password: '123' };
      await expect(service.signup(dto)).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar NotFoundException si el rol por defecto no existe', async () => {
      mockQueryBuilderUser.getOne.mockResolvedValueOnce(null);
      mockQueryBuilderRole.getOne.mockResolvedValueOnce(null);

      const dto = { fullName: 'Juan', email: 'juan@test.com', password: '123' };
      await expect(service.signup(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('login', () => {
    it('debería iniciar sesión y devolver un token', async () => {
      const hashedPassword = await bcrypt.hash('123456', 10);
      mockQueryBuilderUser.getOne.mockResolvedValueOnce({
        id: 'user-uuid-1',
        fullName: 'Juan',
        email: 'juan@test.com',
        password: hashedPassword,
        isActive: true,
        role: { name: RoleEnum.USER },
      });

      const dto = { email: 'juan@test.com', password: '123456' };
      const result = await service.login(dto);

      expect(result).toHaveProperty('accessToken', 'mocked-jwt-token');
      expect(result.message).toBe('Inicio de sesión exitoso');
    });

    it('debería lanzar UnauthorizedException si las credenciales son incorrectas', async () => {
      mockQueryBuilderUser.getOne.mockResolvedValueOnce(null);

      const dto = { email: 'juan@test.com', password: 'wrong' };
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
