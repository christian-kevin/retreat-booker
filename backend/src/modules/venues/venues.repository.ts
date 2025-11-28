import { Injectable } from '@nestjs/common';
import { Prisma, Venue } from '@prisma/client';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class VenuesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    where: Prisma.VenueWhereInput,
    skip: number,
    take: number,
  ): Promise<Venue[]> {
    return this.prisma.venue.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(where: Prisma.VenueWhereInput): Promise<number> {
    return this.prisma.venue.count({ where });
  }
}

