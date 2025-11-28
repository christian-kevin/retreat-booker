import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { BookingInquiriesService } from './booking-inquiries.service';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { LoggerService } from '@/shared/logger/logger.service';

describe('BookingInquiriesService', () => {
  let service: BookingInquiriesService;
  let prismaService: PrismaService;
  let loggerService: LoggerService;

  const mockTransaction = jest.fn();
  const mockPrismaService = {
    $transaction: mockTransaction,
    venue: {
      findUnique: jest.fn(),
    },
    bookingInquiry: {
      create: jest.fn(),
      findFirst: jest.fn(),
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
        BookingInquiriesService,
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

    service = module.get<BookingInquiriesService>(BookingInquiriesService);
    prismaService = module.get<PrismaService>(PrismaService);
    loggerService = module.get<LoggerService>(LoggerService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const validInquiry = {
      venueId: '123',
      companyName: 'Acme Corp',
      email: 'test@acme.com',
      startDate: '2025-01-15',
      endDate: '2025-01-20',
      attendeeCount: 30,
    };

    const mockVenue = {
      id: '123',
      name: 'Test Venue',
      city: 'Denver',
      country: 'USA',
      address: '123 Test St',
      capacity: 50,
      pricePerNight: 3000,
      description: 'Test venue',
      amenities: ['WiFi'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a booking inquiry successfully', async () => {
      const mockCreatedInquiry = {
        id: 'inquiry-1',
        ...validInquiry,
        version: 0,
        createdAt: new Date(),
      };

      mockTransaction.mockImplementation(async (callback) => {
        const tx = {
          venue: {
            findUnique: jest.fn().mockResolvedValue(mockVenue),
          },
          bookingInquiry: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockCreatedInquiry),
          },
        };
        return callback(tx);
      });

      const result = await service.create(validInquiry);

      expect(result).toEqual(mockCreatedInquiry);
      expect(mockLoggerService.log).toHaveBeenCalled();
    });

    it('should throw BadRequestException when venue not found', async () => {
      mockTransaction.mockImplementation(async (callback) => {
        const tx = {
          venue: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
          bookingInquiry: {
            findFirst: jest.fn(),
            create: jest.fn(),
          },
        };
        return callback(tx);
      });

      await expect(service.create(validInquiry)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(validInquiry)).rejects.toThrow(
        'Venue not found',
      );

      expect(mockLoggerService.warn).toHaveBeenCalledWith(
        expect.stringContaining('Venue not found'),
        'BookingInquiriesService',
      );
    });

    it('should throw BadRequestException when attendee count exceeds capacity', async () => {
      const overCapacityInquiry = {
        ...validInquiry,
        attendeeCount: 100,
      };

      mockTransaction.mockImplementation(async (callback) => {
        const tx = {
          venue: {
            findUnique: jest.fn().mockResolvedValue(mockVenue),
          },
          bookingInquiry: {
            findFirst: jest.fn(),
            create: jest.fn(),
          },
        };
        return callback(tx);
      });

      await expect(service.create(overCapacityInquiry)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(overCapacityInquiry)).rejects.toThrow(
        /exceeds venue capacity/,
      );

      expect(mockLoggerService.warn).toHaveBeenCalled();
    });

    it('should throw ConflictException when date range overlaps', async () => {
      const overlappingBooking = {
        id: 'existing-booking',
        venueId: validInquiry.venueId,
        startDate: new Date('2025-01-10'),
        endDate: new Date('2025-01-18'),
      };

      mockTransaction.mockImplementation(async (callback) => {
        const tx = {
          venue: {
            findUnique: jest.fn().mockResolvedValue(mockVenue),
          },
          bookingInquiry: {
            findFirst: jest.fn().mockResolvedValue(overlappingBooking),
            create: jest.fn(),
          },
        };
        return callback(tx);
      });

      await expect(service.create(validInquiry)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(validInquiry)).rejects.toThrow(
        'Date range conflicts',
      );

      expect(mockLoggerService.warn).toHaveBeenCalled();
    });

    it('should accept attendee count equal to capacity', async () => {
      const maxCapacityInquiry = {
        ...validInquiry,
        attendeeCount: 50,
      };

      const mockCreatedInquiry = {
        id: 'inquiry-2',
        ...maxCapacityInquiry,
        version: 0,
        createdAt: new Date(),
      };

      mockTransaction.mockImplementation(async (callback) => {
        const tx = {
          venue: {
            findUnique: jest.fn().mockResolvedValue(mockVenue),
          },
          bookingInquiry: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockCreatedInquiry),
          },
        };
        return callback(tx);
      });

      const result = await service.create(maxCapacityInquiry);

      expect(result).toEqual(mockCreatedInquiry);
    });
  });
});

