import { IsString, IsEmail, IsInt, Min, IsDateString } from 'class-validator';

export class CreateBookingInquiryDto {
  @IsString()
  venueId: string;

  @IsString()
  companyName: string;

  @IsEmail()
  email: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsInt()
  @Min(1)
  attendeeCount: number;
}

