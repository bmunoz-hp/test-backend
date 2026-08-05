import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SaleStatus } from './entities/sale.entity';

describe('SalesController', () => {
  let controller: SalesController;

  const mockSalesService = {
    create: jest.fn().mockResolvedValue({
      message: 'Venta registrada y stock actualizado correctamente',
      id: 'sale-uuid-1',
      total: 250,
    }),
    findAll: jest.fn().mockResolvedValue({
      data: [{ id: 'sale-uuid-1', total: 250 }],
      total: 1,
      page: 1,
      lastPage: 1,
    }),
    findOne: jest.fn().mockResolvedValue({ id: 'sale-uuid-1', total: 250 }),
    updateStatus: jest.fn().mockResolvedValue({
      message: "El estado de la venta con ID sale-uuid-1 se actualizó correctamente a 'COMPLETED'",
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [
        {
          provide: SalesService,
          useValue: mockSalesService,
        },
      ],
    }).compile();

    controller = module.get<SalesController>(SalesController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería crear una venta', async () => {
    const dto: CreateSaleDto = { items: [{ productId: 'prod-uuid-1', quantity: 2 }] };
    const result = await controller.create(dto);
    expect(result).toHaveProperty('id', 'sale-uuid-1');
  });

  it('debería listar ventas paginadas', async () => {
    const result = await controller.findAll(1, 10);
    expect(result.data).toHaveLength(1);
  });

  it('debería obtener una venta por ID', async () => {
    const result = await controller.findOne('sale-uuid-1');
    expect(result).toHaveProperty('id', 'sale-uuid-1');
  });

  it('debería actualizar el estado de una venta', async () => {
    const dto: UpdateSaleDto = { status: SaleStatus.COMPLETED };
    const result = await controller.updateStatus('sale-uuid-1', dto);
    expect(result.message).toContain('COMPLETED');
  });
});
