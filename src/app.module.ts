import { Module } from '@nestjs/common';
import { VenuesModule } from './modules/venues/venues.module';
import { BookingInquiriesModule } from './modules/booking-inquiries/booking-inquiries.module';
import { PrismaModule } from './shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule, VenuesModule, BookingInquiriesModule],
})
export class AppModule {}

