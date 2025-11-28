import { Controller, Get, Query } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { VenuesQueryDto } from './dto/venues-query.dto';

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  findAll(@Query() query: VenuesQueryDto) {
    return this.venuesService.findAll(query);
  }
}

