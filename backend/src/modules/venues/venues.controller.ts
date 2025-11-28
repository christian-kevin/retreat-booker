import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { VenuesService } from './venues.service';
import { VenuesQueryDto } from './dto/venues-query.dto';

@ApiTags('venues')
@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated venues with optional filters' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({
    name: 'minCapacity',
    required: false,
    description: 'Minimum attendee capacity',
    type: Number,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Maximum price per night',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 10, max: 100)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of venues matching the criteria',
  })
  findAll(@Query() query: VenuesQueryDto) {
    return this.venuesService.findAll(query);
  }

  @Get('cities')
  @ApiOperation({ summary: 'Get distinct list of venue cities' })
  @ApiResponse({
    status: 200,
    description: 'List of cities that currently have venues',
    type: [String],
  })
  findCities() {
    return this.venuesService.getCities();
  }
}

