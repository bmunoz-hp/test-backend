import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { DataSource } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('SalesService', () => {
  let service: SalesService;

  const mockQueryRunnerManager = {
    createQueryBuilder: jest.fn().mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      into: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ identifiers: [{ id: 'sale-uuid-1' }] }),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({ id: 'prod-uuid-1', name: 'Product 1', price: 100, stock: 10 }),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    }),
  };

  const mockQueryRunner = {
    connect: jest.fn().mockResolvedValue(undefined),
    startTransaction: jest.fn().mockResolvedValue(undefined),
    commitTransaction: jest.fn().mockResolvedValue(undefined),
    rollbackTransaction: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
    manager: mockQueryRunnerManager,
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[{ id: 'sale-uuid-1', total: 200 }], 1]),
    getOne: jest.fn().mockResolvedValue({ id: 'sale-uuid-1', total: 200 }),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockSaleRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: getRepositoryToken(Sale),
          useValue: mockSaleRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería registrar una venta y descontar stock exitosamente', async () => {
    const dto = { items: [{ productId: 'prod-uuid-1', quantity: 2 }] };
    const result = await service.create(dto);

    expect(result).toHaveProperty('id', 'sale-uuid-1');
    expect(result.total).toBe(200);
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
  });

  it('debería hacer rollback si el producto no existe', async () => {
    mockQueryRunnerManager.createQueryBuilder().getOne.mockResolvedValueOnce(null);

    const dto = { items: [{ productId: 'invalid-prod', quantity: 1 }] };
    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
  });

  it('debería hacer rollback si no hay stock suficiente', async () => {
    mockQueryRunnerManager.createQueryBuilder().getOne.mockResolvedValueOnce({
      id: 'prod-uuid-1',
      name: 'Product 1',
      price: 100,
      stock: 1, // Insuficiente para solicitar 5
    });

    const dto = { items: [{ productId: 'prod-uuid-1', quantity: 5 }] };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
  });

  it('debería listar ventas paginadas', async () => {
    const result = await service.findAll(1, 10);
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
  });
});
