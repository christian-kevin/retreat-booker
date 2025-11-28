import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { BookingInquiriesService } from './booking-inquiries.service';
import { CreateBookingInquiryDto } from './dto/create-booking-inquiry.dto';

@ApiTags('booking-inquiries')
@Controller('booking-inquiries')
export class BookingInquiriesController {
  constructor(
    private readonly bookingInquiriesService: BookingInquiriesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a booking inquiry' })
  @ApiBody({ type: CreateBookingInquiryDto })
  @ApiResponse({
    status: 201,
    description: 'Booking inquiry created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed or capacity exceeded',
  })
  create(@Body() createDto: CreateBookingInquiryDto) {
    return this.bookingInquiriesService.create(createDto);
  }
}

