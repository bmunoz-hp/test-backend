import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role, RoleEnum } from './entities/role.entity';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockQueryBuilderUser = {
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ identifiers: [{ id: 'user-uuid-1' }] }),
  };

  const mockQueryBuilderRole = {
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue({ id: 'role-uuid-1', name: RoleEnum.USER }),
  };

  const mockUserRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilderUser),
  };

  const mockRoleRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilderRole),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería crear un usuario exitosamente', async () => {
    mockQueryBuilderUser.getOne.mockResolvedValueOnce(null); // No existe email duplicado

    const dto = { fullName: 'Juan Perez', email: 'juan@test.com', password: 'password123' };
    const result = await service.create(dto);

    expect(result).toHaveProperty('id', 'user-uuid-1');
    expect(result.message).toBe('Usuario creado correctamente');
  });

  it('debería lanzar BadRequestException si el email ya existe', async () => {
    mockQueryBuilderUser.getOne.mockResolvedValueOnce({ id: 'user-uuid-existing' });

    const dto = { fullName: 'Juan Perez', email: 'juan@test.com', password: 'password123' };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });
});
