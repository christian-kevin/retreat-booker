import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { LoggerService } from '@/shared/logger/logger.service';
import { CreateBookingInquiryDto } from './dto/create-booking-inquiry.dto';
import {
  BookingInquiriesRepository,
  BookingInquiriesRepositoryTx,
} from './booking-inquiries.repository';

@Injectable()
export class BookingInquiriesService {
  constructor(
    private readonly bookingRepository: BookingInquiriesRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(createDto: CreateBookingInquiryDto) {
    this.logger.log(
      `Creating booking inquiry for venue ${createDto.venueId}`,
      'BookingInquiriesService',
    );

    const startDate = new Date(createDto.startDate);
    const endDate = new Date(createDto.endDate);
    const now = new Date();

    if (startDate >= endDate) {
      this.logger.warn(
        `Invalid date range: start date ${createDto.startDate} must be before end date ${createDto.endDate}`,
        'BookingInquiriesService',
      );
      throw new BadRequestException(
        'Start date must be before end date',
      );
    }

    if (startDate < now) {
      this.logger.warn(
        `Start date ${createDto.startDate} is in the past`,
        'BookingInquiriesService',
      );
      throw new BadRequestException('Start date cannot be in the past');
    }

    const venue = await this.bookingRepository.findVenueById(createDto.venueId);

    if (!venue) {
      this.logger.warn(
        `Venue not found: ${createDto.venueId}`,
        'BookingInquiriesService',
      );
      throw new BadRequestException('Venue not found');
    }

    if (createDto.attendeeCount > venue.capacity) {
      this.logger.warn(
        `Attendee count ${createDto.attendeeCount} exceeds venue capacity ${venue.capacity}`,
        'BookingInquiriesService',
      );
      throw new BadRequestException(
        `Attendee count exceeds venue capacity of ${venue.capacity}`,
      );
    }

    const inquiry = await this.bookingRepository.runInTransaction(
      async (repo: BookingInquiriesRepositoryTx) => {
        const overlapping = await repo.findOverlappingBooking(
          createDto.venueId,
          startDate,
          endDate,
        );

        if (overlapping) {
          this.logger.warn(
            `Date range conflicts with existing booking for venue ${createDto.venueId}`,
            'BookingInquiriesService',
          );
          throw new ConflictException(
            'Date range conflicts with existing booking',
          );
        }

        return repo.createBookingInquiry({
          ...createDto,
          startDate,
          endDate,
          version: 0,
        });
      },
    );

    this.logger.log(
      `Booking inquiry created: ${inquiry.id}`,
      'BookingInquiriesService',
    );
    return inquiry;
  }
}

