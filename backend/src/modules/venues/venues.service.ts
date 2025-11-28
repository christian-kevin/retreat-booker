import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/shared/logger/logger.service';
import { VenuesQueryDto } from './dto/venues-query.dto';
import { VenuesRepository } from './venues.repository';

@Injectable()
export class VenuesService {
  constructor(
    private readonly venuesRepository: VenuesRepository,
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
      this.venuesRepository.findMany(where, skip, limit),
      this.venuesRepository.count(where),
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

  async getCities() {
    this.logger.log('Fetching distinct venue cities', 'VenuesService');
    const records = await this.venuesRepository.findDistinctCities();
    return records.map(({ city }) => city).filter(Boolean);
  }
}

