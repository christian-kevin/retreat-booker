import { Controller, Post, Body } from '@nestjs/common';
import { BookingInquiriesService } from './booking-inquiries.service';
import { CreateBookingInquiryDto } from './dto/create-booking-inquiry.dto';

@Controller('booking-inquiries')
export class BookingInquiriesController {
  constructor(
    private readonly bookingInquiriesService: BookingInquiriesService,
  ) {}

  @Post()
  create(@Body() createDto: CreateBookingInquiryDto) {
    return this.bookingInquiriesService.create(createDto);
  }
}

