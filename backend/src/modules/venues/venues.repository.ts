import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class VenuesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(where: Record<string, any>, skip: number, take: number) {
    return this.prisma.venue.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  count(where: Record<string, any>) {
    return this.prisma.venue.count({ where });
  }

  findDistinctCities() {
    return this.prisma.venue.findMany({
      distinct: ['city'],
      select: { city: true },
      orderBy: { city: 'asc' },
    });
  }
}

