import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn().mockResolvedValue({
      message: 'Usuario creado correctamente',
      id: 'user-uuid-1',
    }),
    findAll: jest.fn().mockResolvedValue([
      { id: 'user-uuid-1', fullName: 'Juan Perez', email: 'juan@test.com' },
    ]),
    findOne: jest.fn().mockResolvedValue({
      id: 'user-uuid-1',
      fullName: 'Juan Perez',
      email: 'juan@test.com',
    }),
    update: jest.fn().mockResolvedValue({
      message: 'Usuario con ID user-uuid-1 actualizado correctamente',
    }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería crear un usuario', async () => {
    const dto: CreateUserDto = {
      fullName: 'Juan Perez',
      email: 'juan@test.com',
      password: 'password123',
    };
    const result = await controller.create(dto);
    expect(result).toHaveProperty('id', 'user-uuid-1');
  });

  it('debería obtener todos los usuarios', async () => {
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
  });
});
