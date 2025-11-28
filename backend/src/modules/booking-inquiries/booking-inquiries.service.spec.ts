import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { BookingInquiriesService } from './booking-inquiries.service';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { LoggerService } from '@/shared/logger/logger.service';

describe('BookingInquiriesService', () => {
  let service: BookingInquiriesService;
  let prismaService: PrismaService;
  let loggerService: LoggerService;

  const mockPrismaService = {
    venue: {
      findUnique: jest.fn(),
    },
    bookingInquiry: {
      create: jest.fn(),
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
        createdAt: new Date(),
      };

      mockPrismaService.venue.findUnique.mockResolvedValue(mockVenue);
      mockPrismaService.bookingInquiry.create.mockResolvedValue(
        mockCreatedInquiry,
      );

      const result = await service.create(validInquiry);

      expect(result).toEqual(mockCreatedInquiry);
      expect(mockPrismaService.venue.findUnique).toHaveBeenCalledWith({
        where: { id: validInquiry.venueId },
      });
      expect(mockPrismaService.bookingInquiry.create).toHaveBeenCalledWith({
        data: validInquiry,
      });
      expect(mockLoggerService.log).toHaveBeenCalled();
    });

    it('should throw BadRequestException when venue not found', async () => {
      mockPrismaService.venue.findUnique.mockResolvedValue(null);

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

      mockPrismaService.venue.findUnique.mockResolvedValue(mockVenue);

      await expect(service.create(overCapacityInquiry)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(overCapacityInquiry)).rejects.toThrow(
        /exceeds venue capacity/,
      );

      expect(mockLoggerService.warn).toHaveBeenCalled();
      expect(mockPrismaService.bookingInquiry.create).not.toHaveBeenCalled();
    });

    it('should accept attendee count equal to capacity', async () => {
      const maxCapacityInquiry = {
        ...validInquiry,
        attendeeCount: 50,
      };

      const mockCreatedInquiry = {
        id: 'inquiry-2',
        ...maxCapacityInquiry,
        createdAt: new Date(),
      };

      mockPrismaService.venue.findUnique.mockResolvedValue(mockVenue);
      mockPrismaService.bookingInquiry.create.mockResolvedValue(
        mockCreatedInquiry,
      );

      const result = await service.create(maxCapacityInquiry);

      expect(result).toEqual(mockCreatedInquiry);
      expect(mockPrismaService.bookingInquiry.create).toHaveBeenCalled();
    });
  });
});

