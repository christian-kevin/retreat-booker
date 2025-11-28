import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { VenuesQueryDto } from './dto/venues-query.dto';

@Injectable()
export class VenuesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: VenuesQueryDto) {
    const { city, minCapacity, maxPrice } = query;

    return this.prisma.venue.findMany({
      where: {
        ...(city && { city }),
        ...(minCapacity && { capacity: { gte: minCapacity } }),
        ...(maxPrice && { pricePerNight: { lte: maxPrice } }),
      },
    });
  }
}

