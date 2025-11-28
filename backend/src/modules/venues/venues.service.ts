import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { LoggerService } from '@/shared/logger/logger.service';
import { VenuesQueryDto } from './dto/venues-query.dto';

@Injectable()
export class VenuesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async findAll(query: VenuesQueryDto) {
    const { city, minCapacity, maxPrice } = query;
    this.logger.log(
      `Fetching venues with filters: ${JSON.stringify(query)}`,
      'VenuesService',
    );

    const venues = await this.prisma.venue.findMany({
      where: {
        ...(city && { city }),
        ...(minCapacity && { capacity: { gte: minCapacity } }),
        ...(maxPrice && { pricePerNight: { lte: maxPrice } }),
      },
    });

    this.logger.log(`Found ${venues.length} venues`, 'VenuesService');
    return venues;
  }
}

