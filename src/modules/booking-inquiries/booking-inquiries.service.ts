import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateBookingInquiryDto } from './dto/create-booking-inquiry.dto';

@Injectable()
export class BookingInquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateBookingInquiryDto) {
    const venue = await this.prisma.venue.findUnique({
      where: { id: createDto.venueId },
    });

    if (!venue) {
      throw new BadRequestException('Venue not found');
    }

    if (createDto.attendeeCount > venue.capacity) {
      throw new BadRequestException(
        `Attendee count exceeds venue capacity of ${venue.capacity}`,
      );
    }

    return this.prisma.bookingInquiry.create({
      data: createDto,
    });
  }
}

