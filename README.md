# Retreat Venue Management System

A full-stack venue management system for booking team offsite locations.

## Tech Stack

**Backend:**
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker

**Frontend:**
- Next.js 14
- TypeScript
- React
- TailwindCSS

## Project Structure

```
retreat/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── modules/  # Feature modules
│   │   └── shared/   # Shared services
│   ├── prisma/       # Database schema & seeds
│   └── docker-compose.yml
└── web/              # Next.js frontend
    ├── app/          # App router pages
    └── components/   # React components
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start PostgreSQL
docker-compose up -d postgres

# Create .env file
echo 'DATABASE_URL="postgresql://retreat:retreat123@localhost:5432/retreat_db?schema=public"' > .env

# Run migrations and seed data
npx prisma migrate dev --name init
npx prisma db seed

# Start the API
npm run start:dev
```

Backend will be available at `http://localhost:3000`

### Frontend Setup

```bash
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3001`

### Docker Setup (Full Stack)

```bash
# From project root
docker-compose up
```

### Code Quality

**Linting:**
```bash
npm run lint              # Local
npm run docker:lint       # Docker
```

**Formatting:**
```bash
npm run format            # Local
npm run docker:format     # Docker
```

## API Endpoints

### Venues

`GET /venues`

Query parameters:
- `city` - Filter by location
- `minCapacity` - Filter by minimum attendee capacity
- `maxPrice` - Filter by maximum price per night

**Example:**
```bash
curl "http://localhost:3000/venues?city=Denver&minCapacity=30&maxPrice=5000"
```

### Booking Inquiries

`POST /booking-inquiries`

Request body:
```json
{
  "venueId": "uuid",
  "companyName": "string",
  "email": "string",
  "startDate": "2025-01-01",
  "endDate": "2025-01-05",
  "attendeeCount": 20
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/booking-inquiries \
  -H "Content-Type: application/json" \
  -d '{"venueId":"...","companyName":"Acme Corp","email":"test@example.com","startDate":"2025-01-01","endDate":"2025-01-05","attendeeCount":20}'
```

## Architecture & Approach

### Backend Design

**Modular Architecture:**
- Each feature (venues, booking-inquiries) is a self-contained NestJS module
- Shared services (Prisma, Logger) are global modules
- Clear separation between controllers, services, and DTOs

**Database Schema:**
- `Venue` model with indexed fields for efficient filtering
- `BookingInquiry` model with foreign key to Venue
- Prisma for type-safe database access and migrations

**Validation:**
- Class-validator for DTO validation
- Business logic validation (capacity checks) in service layer

**Logging:**
- Custom logger service for structured logging
- Logs all API operations and errors

### Frontend Design

**Component Structure:**
- Server and client components separation
- Reusable form components
- Centralized API service layer

**State Management:**
- React hooks for local state
- URL search params for filter state persistence

**Error Handling:**
- Try-catch blocks with user-friendly error messages
- Loading states for better UX

### Tradeoffs

**What I Chose:**
1. **Prisma over TypeORM** - Better TypeScript integration and DX
2. **Class-validator** - Declarative validation with decorators
3. **Custom logger** - Simple, sufficient for this scope (vs. Winston/Pino)
4. **SQLite option mentioned** - But used PostgreSQL for production-readiness
5. **Inline styles avoided** - Used TailwindCSS for maintainable styling

**Tradeoffs Made:**
1. **No authentication** - Simplified scope, would add JWT/OAuth in production
2. **No pagination** - Works for demo with 10 venues, would add for scale
3. **Simple error handling** - Basic validation, would add more edge cases
4. **No testing** - Focused on functionality, would add unit/e2e tests
5. **No caching** - Direct DB queries, would add Redis for production

## What I'd Improve With More Time

### Backend
1. **Authentication & Authorization** - JWT tokens, role-based access
2. **Testing** - Unit tests (Jest), E2E tests (Supertest)
3. **Pagination** - Cursor-based pagination for venues endpoint
4. **Rate Limiting** - Prevent abuse
5. **Email Service** - Send confirmation emails for booking inquiries
6. **Availability Checking** - Prevent double-bookings
7. **Advanced Filters** - Price ranges, date availability, amenities
8. **API Versioning** - /v1/ prefix for future compatibility
9. **OpenAPI/Swagger** - Auto-generated API documentation
10. **Monitoring** - APM, error tracking (Sentry), metrics

### Frontend
1. **Date Picker** - Better UX with calendar component
2. **Image Gallery** - Venue photos
3. **Map Integration** - Show venue locations
4. **Form Validation** - Real-time field validation
5. **Responsive Design** - Mobile-optimized layouts
6. **Accessibility** - ARIA labels, keyboard navigation
7. **Testing** - Component tests (React Testing Library)
8. **SEO** - Meta tags, structured data
9. **State Management** - Zustand/Redux for complex state
10. **Animation** - Smooth transitions and loading skeletons

### DevOps
1. **CI/CD Pipeline** - GitHub Actions for automated testing/deployment
2. **Environment Management** - Staging/production configs
3. **Database Migrations** - Automated migration strategy
4. **Health Checks** - Kubernetes-ready health endpoints
5. **Docker Optimization** - Multi-stage builds, smaller images
6. **Deployment** - Deploy to Vercel (frontend) and Railway/Render (backend)

### General
1. **Monorepo Tools** - Turborepo or Nx for better DX
2. **Code Documentation** - JSDoc comments
3. **Performance** - Database query optimization, indexes
4. **Security** - CORS, Helmet, input sanitization
5. **Internationalization** - Multi-language support

## Deployment

### Backend (Railway/Render)
```bash
# Set environment variables
DATABASE_URL=<production-db-url>

# Deploy
git push railway main
```

### Frontend (Vercel)
```bash
# Set environment variables
NEXT_PUBLIC_API_URL=<backend-url>

# Deploy
vercel --prod
```

## License

MIT

