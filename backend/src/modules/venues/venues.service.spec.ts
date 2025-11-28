import { Test, TestingModule } from '@nestjs/testing';
import { VenuesService } from './venues.service';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { LoggerService } from '@/shared/logger/logger.service';

describe('VenuesService', () => {
  let service: VenuesService;
  let prismaService: PrismaService;
  let loggerService: LoggerService;

  const mockPrismaService = {
    venue: {
      findMany: jest.fn(),
    },
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VenuesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<VenuesService>(VenuesService);
    prismaService = module.get<PrismaService>(PrismaService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all venues when no filters provided', async () => {
      const mockVenues = [
        {
          id: '1',
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
        },
      ];

      mockPrismaService.venue.findMany.mockResolvedValue(mockVenues);

      const result = await service.findAll({});

      expect(result).toEqual(mockVenues);
      expect(mockPrismaService.venue.findMany).toHaveBeenCalledWith({
        where: {},
      });
      expect(mockLoggerService.log).toHaveBeenCalled();
    });

    it('should filter venues by city', async () => {
      const mockVenues = [
        {
          id: '1',
          name: 'Denver Venue',
          city: 'Denver',
          country: 'USA',
          address: '123 Test St',
          capacity: 50,
          pricePerNight: 3000,
          description: 'Test description',
          amenities: ['WiFi'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.venue.findMany.mockResolvedValue(mockVenues);

      const result = await service.findAll({ city: 'Denver' });

      expect(result).toEqual(mockVenues);
      expect(mockPrismaService.venue.findMany).toHaveBeenCalledWith({
        where: { city: 'Denver' },
      });
    });

    it('should filter venues by minCapacity', async () => {
      const mockVenues = [
        {
          id: '1',
          name: 'Large Venue',
          city: 'Denver',
          country: 'USA',
          address: '123 Test St',
          capacity: 100,
          pricePerNight: 5000,
          description: 'Test description',
          amenities: ['WiFi'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.venue.findMany.mockResolvedValue(mockVenues);

      const result = await service.findAll({ minCapacity: 75 });

      expect(result).toEqual(mockVenues);
      expect(mockPrismaService.venue.findMany).toHaveBeenCalledWith({
        where: { capacity: { gte: 75 } },
      });
    });

    it('should filter venues by maxPrice', async () => {
      const mockVenues = [
        {
          id: '1',
          name: 'Affordable Venue',
          city: 'Denver',
          country: 'USA',
          address: '123 Test St',
          capacity: 50,
          pricePerNight: 2000,
          description: 'Test description',
          amenities: ['WiFi'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.venue.findMany.mockResolvedValue(mockVenues);

      const result = await service.findAll({ maxPrice: 3000 });

      expect(result).toEqual(mockVenues);
      expect(mockPrismaService.venue.findMany).toHaveBeenCalledWith({
        where: { pricePerNight: { lte: 3000 } },
      });
    });

    it('should apply multiple filters', async () => {
      const mockVenues = [];

      mockPrismaService.venue.findMany.mockResolvedValue(mockVenues);

      const result = await service.findAll({
        city: 'Denver',
        minCapacity: 50,
        maxPrice: 4000,
      });

      expect(result).toEqual(mockVenues);
      expect(mockPrismaService.venue.findMany).toHaveBeenCalledWith({
        where: {
          city: 'Denver',
          capacity: { gte: 50 },
          pricePerNight: { lte: 4000 },
        },
      });
    });
  });
});

