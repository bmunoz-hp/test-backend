import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProductosService', () => {
  let service: ProductosService;

  const mockProductoRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((producto) =>
        Promise.resolve({ id: 'uuid-1234', ...producto }),
      ),
    find: jest
      .fn()
      .mockResolvedValue([
        { id: 'uuid-1234', nombre: 'Test', precio: 10, stock: 5 },
      ]),
    findOneBy: jest.fn().mockImplementation(({ id }) => {
      if (id === 'uuid-1234') {
        return Promise.resolve({ id, nombre: 'Test', precio: 10, stock: 5 });
      }
      return Promise.resolve(null);
    }),
    merge: jest
      .fn()
      .mockImplementation((entity, dto) => Object.assign(entity, dto)),
    remove: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(Producto),
          useValue: mockProductoRepository,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería crear un producto exitosamente', async () => {
    const dto = { nombre: 'Nuevo', precio: 100, stock: 20 };
    expect(await service.create(dto)).toEqual({ id: 'uuid-1234', ...dto });
  });

  it('debería obtener un arreglo de productos', async () => {
    const productos = await service.findAll();
    expect(productos).toHaveLength(1);
    expect(productos[0].nombre).toEqual('Test');
  });

  it('debería arrojar NotFoundException si no encuentra el ID', async () => {
    await expect(service.findOne('uuid-invalido')).rejects.toThrow(
      NotFoundException,
    );
  });
});
