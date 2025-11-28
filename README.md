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

**Local:**
```bash
npm run start:dev
```

**Docker:**
```bash
docker-compose up
```

### Code Quality

**Linting:**
```bash
# Local
npm run lint

# Docker
npm run docker:lint
# or
docker-compose run --rm app npm run lint:check
```

**Formatting:**
```bash
# Local
npm run format

# Docker
npm run docker:format
# or
docker-compose run --rm app npm run format:check
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

