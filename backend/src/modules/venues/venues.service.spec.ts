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
      count: jest.fn(),
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
    it('should return paginated venues when no filters provided', async () => {
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
      mockPrismaService.venue.count.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result.data).toEqual(mockVenues);
      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
      expect(mockPrismaService.venue.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(mockPrismaService.venue.count).toHaveBeenCalledWith({
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
      mockPrismaService.venue.count.mockResolvedValue(1);

      const result = await service.findAll({ city: 'Denver' });

      expect(result.data).toEqual(mockVenues);
      expect(mockPrismaService.venue.findMany).toHaveBeenCalledWith({
        where: { city: 'Denver' },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
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
      mockPrismaService.venue.count.mockResolvedValue(1);

      const result = await service.findAll({ minCapacity: 75 });

      expect(result.data).toEqual(mockVenues);
      expect(mockPrismaService.venue.findMany).toHaveBeenCalledWith({
        where: { capacity: { gte: 75 } },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
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
      mockPrismaService.venue.count.mockResolvedValue(1);

      const result = await service.findAll({ maxPrice: 3000 });

      expect(result.data).toEqual(mockVenues);
      expect(mockPrismaService.venue.findMany).toHaveBeenCalledWith({
        where: { pricePerNight: { lte: 3000 } },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should apply multiple filters', async () => {
      const mockVenues = [];

      mockPrismaService.venue.findMany.mockResolvedValue(mockVenues);
      mockPrismaService.venue.count.mockResolvedValue(0);

      const result = await service.findAll({
        city: 'Denver',
        minCapacity: 50,
        maxPrice: 4000,
      });

      expect(result.data).toEqual(mockVenues);
      expect(mockPrismaService.venue.findMany).toHaveBeenCalledWith({
        where: {
          city: 'Denver',
          capacity: { gte: 50 },
          pricePerNight: { lte: 4000 },
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle pagination correctly', async () => {
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
      mockPrismaService.venue.count.mockResolvedValue(25);

      const result = await service.findAll({ page: 2, limit: 10 });

      expect(result.data).toEqual(mockVenues);
      expect(result.meta).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });
      expect(mockPrismaService.venue.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 10,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});

