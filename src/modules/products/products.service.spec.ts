import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockQueryBuilder = {
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ identifiers: [{ id: 'uuid-1234' }] }),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([
      [{ id: 'uuid-1234', name: 'Test', price: 10, stock: 5 }],
      1,
    ]),
    getOne: jest.fn().mockImplementation(() => Promise.resolve(null)),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
  };

  const mockProductRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería crear un producto exitosamente', async () => {
    const dto = { name: 'Nuevo', price: 100, stock: 20 };
    const result = await service.create(dto);
    expect(result).toEqual({
      message: 'Producto creado correctamente',
      id: 'uuid-1234',
    });
  });

  it('debería obtener productos paginados', async () => {
    const result = await service.findAll(1, 10);
    expect(result).toEqual({
      data: [{ id: 'uuid-1234', name: 'Test', price: 10, stock: 5 }],
      total: 1,
      page: 1,
      lastPage: 1,
    });
  });

  it('debería arrojar NotFoundException si no encuentra el ID en findOne', async () => {
    mockQueryBuilder.getOne.mockResolvedValueOnce(null);
    await expect(service.findOne('uuid-invalido')).rejects.toThrow(
      NotFoundException,
    );
  });
});
