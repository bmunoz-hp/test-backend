import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersService } from './suppliers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';

describe('SuppliersService', () => {
  let service: SuppliersService;

  const mockQueryBuilder = {
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ identifiers: [{ id: 'sup-uuid-1' }] }),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([{ id: 'sup-uuid-1', name: 'Distribuidora Tech' }]),
    getOne: jest.fn().mockResolvedValue({ id: 'sup-uuid-1', name: 'Distribuidora Tech' }),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
  };

  const mockSupplierRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuppliersService,
        {
          provide: getRepositoryToken(Supplier),
          useValue: mockSupplierRepository,
        },
      ],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería crear un proveedor exitosamente', async () => {
    const dto = { name: 'Distribuidora Tech', email: 'tech@test.com' };
    const result = await service.create(dto);
    expect(result).toHaveProperty('id', 'sup-uuid-1');
  });
});
