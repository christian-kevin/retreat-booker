import { Injectable, BadRequestException } from '@nestjs/common';
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

    const venue = await this.prisma.venue.findUnique({
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

    const inquiry = await this.prisma.bookingInquiry.create({
      data: createDto,
    });

    this.logger.log(
      `Booking inquiry created: ${inquiry.id}`,
      'BookingInquiriesService',
    );
    return inquiry;
  }
}

