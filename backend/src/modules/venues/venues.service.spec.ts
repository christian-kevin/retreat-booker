import { Test, TestingModule } from '@nestjs/testing';
import { Venue } from '@prisma/client';
import { VenuesService } from './venues.service';
import { VenuesRepository } from './venues.repository';
import { LoggerService } from '@/shared/logger/logger.service';

const createVenue = (overrides: Partial<Venue> = {}): Venue => ({
  id: 'venue-1',
  name: 'Test Venue',
  city: 'Denver',
  country: 'USA',
  address: '123 Test St',
  capacity: 50,
  pricePerNight: 3000,
  description: 'Test description',
  amenities: ['WiFi'],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('VenuesService', () => {
  let service: VenuesService;

  const mockVenuesRepository = {
    findMany: jest.fn(),
    count: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VenuesService,
        { provide: VenuesRepository, useValue: mockVenuesRepository },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<VenuesService>(VenuesService);
  });

  describe('findAll', () => {
    it('returns paginated venues with defaults', async () => {
      const venues = [createVenue()];
      mockVenuesRepository.findMany.mockResolvedValue(venues);
      mockVenuesRepository.count.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result.data).toEqual(venues);
      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
      expect(mockVenuesRepository.findMany).toHaveBeenCalledWith({}, 0, 10);
      expect(mockVenuesRepository.count).toHaveBeenCalledWith({});
    });

    it('applies city filter', async () => {
      const venues = [createVenue({ city: 'Denver' })];
      mockVenuesRepository.findMany.mockResolvedValue(venues);
      mockVenuesRepository.count.mockResolvedValue(1);

      await service.findAll({ city: 'Denver' });

      expect(mockVenuesRepository.findMany).toHaveBeenCalledWith(
        { city: 'Denver' },
        0,
        10,
      );
    });

    it('applies capacity filter', async () => {
      mockVenuesRepository.findMany.mockResolvedValue([]);
      mockVenuesRepository.count.mockResolvedValue(0);

      await service.findAll({ minCapacity: 75 });

      expect(mockVenuesRepository.findMany).toHaveBeenCalledWith(
        { capacity: { gte: 75 } },
        0,
        10,
      );
    });

    it('applies price filter', async () => {
      mockVenuesRepository.findMany.mockResolvedValue([]);
      mockVenuesRepository.count.mockResolvedValue(0);

      await service.findAll({ maxPrice: 4000 });

      expect(mockVenuesRepository.findMany).toHaveBeenCalledWith(
        { pricePerNight: { lte: 4000 } },
        0,
        10,
      );
    });

    it('applies multiple filters and pagination', async () => {
      mockVenuesRepository.findMany.mockResolvedValue([]);
      mockVenuesRepository.count.mockResolvedValue(25);

      const result = await service.findAll({
        city: 'Denver',
        minCapacity: 40,
        maxPrice: 5000,
        page: 2,
        limit: 10,
      });

      expect(mockVenuesRepository.findMany).toHaveBeenCalledWith(
        {
          city: 'Denver',
          capacity: { gte: 40 },
          pricePerNight: { lte: 5000 },
        },
        10,
        10,
      );
      expect(result.meta).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });
  });
});

