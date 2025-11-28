import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { LoggerService } from '@/shared/logger/logger.service';
import { CreateBookingInquiryDto } from './dto/create-booking-inquiry.dto';

@Injectable()
export class BookingInquiriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async create(createDto: CreateBookingInquiryDto) {
    this.logger.log(
      `Creating booking inquiry for venue ${createDto.venueId}`,
      'BookingInquiriesService',
    );

    return this.prisma.$transaction(async (tx) => {
      const venue = await tx.venue.findUnique({
        where: { id: createDto.venueId },
      });

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

      const overlapping = await tx.bookingInquiry.findFirst({
        where: {
          venueId: createDto.venueId,
          startDate: { lte: new Date(createDto.endDate) },
          endDate: { gte: new Date(createDto.startDate) },
        },
      });

      if (overlapping) {
        this.logger.warn(
          `Date range conflicts with existing booking for venue ${createDto.venueId}`,
          'BookingInquiriesService',
        );
        throw new ConflictException(
          'Date range conflicts with existing booking',
        );
      }

      const inquiry = await tx.bookingInquiry.create({
        data: {
          ...createDto,
          startDate: new Date(createDto.startDate),
          endDate: new Date(createDto.endDate),
          version: 0,
        },
      });

      this.logger.log(
        `Booking inquiry created: ${inquiry.id}`,
        'BookingInquiriesService',
      );
      return inquiry;
    });
  }
}

