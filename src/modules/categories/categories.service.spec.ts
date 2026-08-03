import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockCategoryRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((cat) => Promise.resolve({ id: 'uuid-cat-1', ...cat })),
    find: jest.fn().mockResolvedValue([{ id: 'uuid-cat-1', nombre: 'Electrónica' }]),
    findOneBy: jest.fn().mockResolvedValue({ id: 'uuid-cat-1', nombre: 'Electrónica' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });
});
