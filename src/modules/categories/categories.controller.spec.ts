import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const mockCategoriesService = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'uuid-cat-1', ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 'uuid-cat-1', nombre: 'Electrónica' }]),
    findOne: jest.fn().mockImplementation((id) => Promise.resolve({ id, nombre: 'Electrónica' })),
    update: jest.fn().mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });
});
