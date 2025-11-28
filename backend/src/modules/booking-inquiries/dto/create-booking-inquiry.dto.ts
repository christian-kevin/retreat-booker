import { IsString, IsEmail, IsInt, Min, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingInquiryDto {
  @ApiProperty({
    description: 'Venue ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  venueId: string;

  @ApiProperty({ description: 'Company name', example: 'Acme Corporation' })
  @IsString()
  companyName: string;

  @ApiProperty({
    description: 'Contact email',
    example: 'contact@acme.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Start date (ISO 8601)',
    example: '2025-01-15',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date (ISO 8601)',
    example: '2025-01-20',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Number of attendees',
    example: 25,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  attendeeCount: number;
}

