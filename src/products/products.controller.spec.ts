import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './products.controller';
import { ProductosService } from './products.service';

describe('ProductosController', () => {
  let controller: ProductosController;

  const mockProductosService = {
    create: jest.fn().mockImplementation((dto) => {
      return Promise.resolve({ id: 'uuid-1234', ...dto });
    }),
    findAll: jest
      .fn()
      .mockResolvedValue([
        { id: 'uuid-1234', nombre: 'Test', precio: 10, stock: 5 },
      ]),
    findOne: jest.fn().mockImplementation((id) => {
      return Promise.resolve({ id, nombre: 'Test', precio: 10, stock: 5 });
    }),
    update: jest.fn().mockImplementation((id, dto) => {
      return Promise.resolve({ id, ...dto });
    }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        {
          provide: ProductosService,
          useValue: mockProductosService,
        },
      ],
    }).compile();

    controller = module.get<ProductosController>(ProductosController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería crear un producto exitosamente', async () => {
    const dto = { nombre: 'Teclado', precio: 50, stock: 10 };
    expect(await controller.create(dto)).toEqual({
      id: 'uuid-1234',
      ...dto,
    });
  });
});
