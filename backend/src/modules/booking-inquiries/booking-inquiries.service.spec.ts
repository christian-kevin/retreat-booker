import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { BookingInquiriesService } from './booking-inquiries.service';
import {
  BookingInquiriesRepository,
  BookingInquiriesRepositoryTx,
} from './booking-inquiries.repository';
import { LoggerService } from '@/shared/logger/logger.service';

describe('BookingInquiriesService', () => {
  let service: BookingInquiriesService;

  const mockBookingRepository = {
    findVenueById: jest.fn(),
    runInTransaction: jest.fn(),
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
          provide: BookingInquiriesRepository,
          useValue: mockBookingRepository,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<BookingInquiriesService>(BookingInquiriesService);
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
      const txRepo: BookingInquiriesRepositoryTx = {
        findOverlappingBooking: jest.fn().mockResolvedValue(null),
        createBookingInquiry: jest
          .fn()
          .mockResolvedValue({ id: 'inquiry-1', ...validInquiry }),
      } as unknown as BookingInquiriesRepositoryTx;

      mockBookingRepository.findVenueById.mockResolvedValue(mockVenue);
      mockBookingRepository.runInTransaction.mockImplementation((handler) =>
        handler(txRepo),
      );

      const result = await service.create(validInquiry);

      expect(result.id).toEqual('inquiry-1');
      expect(txRepo.findOverlappingBooking).toHaveBeenCalled();
      expect(txRepo.createBookingInquiry).toHaveBeenCalled();
    });

    it('should throw BadRequestException when venue not found', async () => {
      mockBookingRepository.findVenueById.mockResolvedValue(null);

      await expect(service.create(validInquiry)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when attendee count exceeds capacity', async () => {
      mockBookingRepository.findVenueById.mockResolvedValue(mockVenue);

      await expect(
        service.create({ ...validInquiry, attendeeCount: 100 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException on overlapping booking', async () => {
      const txRepo: BookingInquiriesRepositoryTx = {
        findOverlappingBooking: jest
          .fn()
          .mockResolvedValue({ id: 'existing' } as any),
        createBookingInquiry: jest.fn(),
      } as unknown as BookingInquiriesRepositoryTx;

      mockBookingRepository.findVenueById.mockResolvedValue(mockVenue);
      mockBookingRepository.runInTransaction.mockImplementation((handler) =>
        handler(txRepo),
      );

      await expect(service.create(validInquiry)).rejects.toThrow(
        ConflictException,
      );
    });

    it('creates inquiry when attendee count equals capacity', async () => {
      const txRepo: BookingInquiriesRepositoryTx = {
        findOverlappingBooking: jest.fn().mockResolvedValue(null),
        createBookingInquiry: jest.fn().mockResolvedValue({
          id: 'inquiry-2',
          ...validInquiry,
        }),
      } as unknown as BookingInquiriesRepositoryTx;

      mockBookingRepository.findVenueById.mockResolvedValue(mockVenue);
      mockBookingRepository.runInTransaction.mockImplementation((handler) =>
        handler(txRepo),
      );

      const result = await service.create({
        ...validInquiry,
        attendeeCount: mockVenue.capacity,
      });

      expect(result.id).toEqual('inquiry-2');
    });
