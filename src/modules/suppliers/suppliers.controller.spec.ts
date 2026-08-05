import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';

describe('SuppliersController', () => {
  let controller: SuppliersController;

  const mockSuppliersService = {
    create: jest.fn().mockResolvedValue({
      message: 'Proveedor creado correctamente',
      id: 'sup-uuid-1',
    }),
    findAll: jest.fn().mockResolvedValue([
      { id: 'sup-uuid-1', name: 'Distribuidora Tech', email: 'tech@test.com' },
    ]),
    findOne: jest.fn().mockResolvedValue({
      id: 'sup-uuid-1',
      name: 'Distribuidora Tech',
      email: 'tech@test.com',
    }),
    update: jest.fn().mockResolvedValue({
      message: 'Proveedor con ID sup-uuid-1 actualizado correctamente',
    }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersController],
      providers: [
        {
          provide: SuppliersService,
          useValue: mockSuppliersService,
        },
      ],
    }).compile();

    controller = module.get<SuppliersController>(SuppliersController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería crear un proveedor', async () => {
    const dto: CreateSupplierDto = {
      name: 'Distribuidora Tech',
      email: 'tech@test.com',
    };
    const result = await controller.create(dto);
    expect(result).toHaveProperty('id', 'sup-uuid-1');
  });

  it('debería obtener todos los proveedores', async () => {
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
  });
});
