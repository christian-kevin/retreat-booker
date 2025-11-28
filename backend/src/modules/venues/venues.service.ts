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
    const { city, minCapacity, maxPrice, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    this.logger.log(
      `Fetching venues with filters: ${JSON.stringify(query)}`,
      'VenuesService',
    );

    const where = {
      ...(city && { city }),
      ...(minCapacity && { capacity: { gte: minCapacity } }),
      ...(maxPrice && { pricePerNight: { lte: maxPrice } }),
    };

    const [venues, total] = await Promise.all([
      this.prisma.venue.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.venue.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    this.logger.log(
      `Found ${venues.length} venues (page ${page}/${totalPages}, total: ${total})`,
      'VenuesService',
    );

    return {
      data: venues,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}

