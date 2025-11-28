import { Injectable } from '@nestjs/common';
import { Prisma, BookingInquiry, Venue } from '@prisma/client';
import { PrismaService } from '@/shared/prisma/prisma.service';

export class BookingInquiriesRepositoryTx {
  constructor(private readonly tx: Prisma.TransactionClient) {}

  findOverlappingBooking(
    venueId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<BookingInquiry | null> {
    return this.tx.bookingInquiry.findFirst({
      where: {
        venueId,
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
    });
  }

  createBookingInquiry(data: Prisma.BookingInquiryUncheckedCreateInput) {
    return this.tx.bookingInquiry.create({ data });
  }
}

@Injectable()
export class BookingInquiriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findVenueById(venueId: string): Promise<Venue | null> {
    return this.prisma.venue.findUnique({ where: { id: venueId } });
  }

  runInTransaction<T>(
    handler: (repo: BookingInquiriesRepositoryTx) => Promise<T>,
  ) {
    return this.prisma.$transaction((tx) =>
      handler(new BookingInquiriesRepositoryTx(tx)),
    );
  }
}

