import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/shared/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let testVenueId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);

    const venue = await prismaService.venue.create({
      data: {
        name: 'E2E Test Venue',
        city: 'TestCity',
        country: 'TestCountry',
        address: '123 Test St',
        capacity: 50,
        pricePerNight: 3000,
        description: 'Test venue for e2e',
        amenities: ['WiFi', 'Parking'],
      },
    });
    testVenueId = venue.id;
  });

  afterAll(async () => {
    await prismaService.bookingInquiry.deleteMany({});
    await prismaService.venue.deleteMany({
      where: { name: 'E2E Test Venue' },
    });
    await app.close();
  });

  describe('/venues (GET)', () => {
    it('should return all venues', () => {
      return request(app.getHttpServer())
        .get('/venues')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should filter venues by city', () => {
      return request(app.getHttpServer())
        .get('/venues?city=TestCity')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.every((v: any) => v.city === 'TestCity')).toBe(true);
        });
    });

    it('should filter venues by minCapacity', () => {
      return request(app.getHttpServer())
        .get('/venues?minCapacity=40')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.every((v: any) => v.capacity >= 40)).toBe(true);
        });
    });

    it('should filter venues by maxPrice', () => {
      return request(app.getHttpServer())
        .get('/venues?maxPrice=4000')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.every((v: any) => v.pricePerNight <= 4000)).toBe(
            true,
          );
        });
    });

    it('should return empty array when no venues match filters', () => {
      return request(app.getHttpServer())
        .get('/venues?city=NonExistentCity')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([]);
        });
    });

    it('should reject invalid minCapacity', () => {
      return request(app.getHttpServer())
        .get('/venues?minCapacity=invalid')
        .expect(400);
    });
  });

  describe('/booking-inquiries (POST)', () => {
    it('should create a booking inquiry', () => {
      const inquiry = {
        venueId: testVenueId,
        companyName: 'Test Company',
        email: 'test@example.com',
        startDate: '2025-02-01',
        endDate: '2025-02-05',
        attendeeCount: 30,
      };

      return request(app.getHttpServer())
        .post('/booking-inquiries')
        .send(inquiry)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.venueId).toBe(testVenueId);
          expect(res.body.companyName).toBe('Test Company');
        });
    });

    it('should reject booking inquiry with non-existent venue', () => {
      const inquiry = {
        venueId: '00000000-0000-0000-0000-000000000000',
        companyName: 'Test Company',
        email: 'test@example.com',
        startDate: '2025-02-01',
        endDate: '2025-02-05',
        attendeeCount: 30,
      };

      return request(app.getHttpServer())
        .post('/booking-inquiries')
        .send(inquiry)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Venue not found');
        });
    });

    it('should reject booking inquiry exceeding venue capacity', () => {
      const inquiry = {
        venueId: testVenueId,
        companyName: 'Test Company',
        email: 'test@example.com',
        startDate: '2025-02-01',
        endDate: '2025-02-05',
        attendeeCount: 100,
      };

      return request(app.getHttpServer())
        .post('/booking-inquiries')
        .send(inquiry)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('exceeds venue capacity');
        });
    });

    it('should reject booking inquiry with invalid email', () => {
      const inquiry = {
        venueId: testVenueId,
        companyName: 'Test Company',
        email: 'invalid-email',
        startDate: '2025-02-01',
        endDate: '2025-02-05',
        attendeeCount: 30,
      };

      return request(app.getHttpServer())
        .post('/booking-inquiries')
        .send(inquiry)
        .expect(400);
    });

    it('should reject booking inquiry with missing required fields', () => {
      const inquiry = {
        venueId: testVenueId,
        companyName: 'Test Company',
      };

      return request(app.getHttpServer())
        .post('/booking-inquiries')
        .send(inquiry)
        .expect(400);
    });

    it('should reject booking inquiry with negative attendee count', () => {
      const inquiry = {
        venueId: testVenueId,
        companyName: 'Test Company',
        email: 'test@example.com',
        startDate: '2025-02-01',
        endDate: '2025-02-05',
        attendeeCount: -5,
      };

      return request(app.getHttpServer())
        .post('/booking-inquiries')
        .send(inquiry)
        .expect(400);
    });
  });
});

