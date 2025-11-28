import { Module } from '@nestjs/common';
import { BookingInquiriesController } from './booking-inquiries.controller';
import { BookingInquiriesService } from './booking-inquiries.service';
import { BookingInquiriesRepository } from './booking-inquiries.repository';

@Module({
  controllers: [BookingInquiriesController],
  providers: [BookingInquiriesService, BookingInquiriesRepository],
})
export class BookingInquiriesModule {}

