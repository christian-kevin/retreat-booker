# Retreat Venue Management System

Full-stack venue management system for booking team offsite locations.

## Tech Stack

**Backend:** NestJS, TypeScript, Prisma, PostgreSQL, Docker  
**Frontend:** Next.js 14, TypeScript, React, TailwindCSS

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### Setup

```bash
# Backend
cd backend
npm install
docker-compose up -d postgres
echo 'DATABASE_URL="postgresql://retreat:retreat123@localhost:5432/retreat_db?schema=public"' > .env
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev

# Frontend (new terminal)
cd web
npm install
npm run dev
```

**Or use Docker:**
```bash
docker-compose up
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`
- API Docs: `http://localhost:3000/api` (Swagger)

## Testing

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Docker
docker-compose --profile test run --rm backend-test
docker-compose --profile test run --rm backend-e2e
```

## API Endpoints

### GET /venues
Query params: `city`, `minCapacity`, `maxPrice`

### POST /booking-inquiries
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

## Architecture

- **Backend:** Modular NestJS architecture with Prisma ORM
- **Frontend:** Next.js App Router with server/client components
- **Database:** PostgreSQL with Prisma migrations
- **Validation:** Class-validator DTOs with business logic checks
- **Documentation:** Swagger/OpenAPI at `/api`

## Improvements With More Time

**Backend:** Authentication (JWT), pagination, rate limiting, email service, availability checking, API versioning

**Frontend:** Date picker, image gallery, map integration, real-time validation, accessibility, component tests

**Environment Management:**
- Multiple environments (dev, staging, production) with separate configs
- Environment-specific database instances
- Feature flags per environment
- Environment-based feature toggles

**Configuration & Secrets Management:**
- HashiCorp Vault for secure secrets storage
- Dynamic configuration updates without redeployment
- Secret rotation policies
- Environment-specific secrets (API keys, DB credentials, JWT secrets)
- Integration with CI/CD for automated secret injection

**Feature Flags:**
- Flipper or LaunchDarkly for feature toggling
- A/B testing capabilities
- Gradual feature rollouts
- Kill switches for problematic features
- User/tenant-based feature flags

**DevOps & CI/CD:** GitHub Actions pipeline, automated testing/deployment, test coverage reporting, security scanning, multi-environment deployments

**Monitoring:** APM (New Relic/Datadog), error tracking (Sentry), metrics (Prometheus/Grafana), uptime monitoring, performance tracking

## Deployment

**Backend:** Railway/Render with PostgreSQL  
**Frontend:** Vercel

See `DEPLOYMENT.md` for detailed instructions.

## License

MIT
