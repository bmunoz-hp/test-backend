import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-producto.dto';
import { UpdateProductDto } from './dto/update-producto.dto';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProductsService = {
    create: jest.fn().mockImplementation((dto: CreateProductDto) => {
      return Promise.resolve({ message: 'Producto creado correctamente', id: 'uuid-1234' });
    }),
    findAll: jest.fn().mockResolvedValue({
      data: [{ id: 'uuid-1234', name: 'Teclado', price: 50, stock: 10 }],
      total: 1,
      page: 1,
      lastPage: 1,
    }),
    findOne: jest.fn().mockImplementation((id: string) => {
      return Promise.resolve({ id, name: 'Teclado', price: 50, stock: 10 });
    }),
    update: jest.fn().mockImplementation((id: string, dto: UpdateProductDto) => {
      return Promise.resolve({ message: `Producto con ID ${id} actualizado correctamente` });
    }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería crear un producto exitosamente', async () => {
    const dto: CreateProductDto = { name: 'Teclado', price: 50, stock: 10 };
    expect(await controller.create(dto)).toEqual({
      message: 'Producto creado correctamente',
      id: 'uuid-1234',
    });
  });

  it('debería obtener la lista paginada de productos', async () => {
    const result = await controller.findAll();
    expect(result).toEqual({
      data: [{ id: 'uuid-1234', name: 'Teclado', price: 50, stock: 10 }],
      total: 1,
      page: 1,
      lastPage: 1,
    });
  });

  it('debería obtener un producto por ID', async () => {
    const result = await controller.findOne('uuid-1234');
    expect(result).toEqual({
      id: 'uuid-1234',
      name: 'Teclado',
      price: 50,
      stock: 10,
    });
  });

  it('debería actualizar un producto por ID', async () => {
    const dto: UpdateProductDto = { price: 60 };
    const result = await controller.update('uuid-1234', dto);
    expect(result).toEqual({
      message: 'Producto con ID uuid-1234 actualizado correctamente',
    });
  });

  it('debería eliminar un producto por ID', async () => {
    expect(await controller.remove('uuid-1234')).toBeUndefined();
  });
});
