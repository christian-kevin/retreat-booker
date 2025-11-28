# Retreat Venue Management System

A venue management system for booking team offsite locations.

## Tech Stack

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Docker

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose

### Installation

```bash
npm install
```

### Database Setup

```bash
docker-compose up -d
npx prisma migrate dev
npx prisma db seed
```

### Running the Application

```bash
npm run start:dev
```

## API Endpoints

### Venues

`GET /venues`

Query parameters:
- `city` - Filter by location
- `minCapacity` - Filter by minimum attendee capacity
- `maxPrice` - Filter by maximum price per night

### Booking Inquiries

`POST /booking-inquiries`

Request body:
```json
{
  "venueId": "string",
  "companyName": "string",
  "email": "string",
  "startDate": "2025-01-01",
  "endDate": "2025-01-05",
  "attendeeCount": 20
}
```

