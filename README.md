# Retreat Venue Management System

Full-stack venue management system for booking team offsite locations.

## Tech Stack

**Backend:** NestJS, TypeScript, Prisma, PostgreSQL, Docker  
**Frontend:** Next.js 14, TypeScript, React, TailwindCSS

## Setup Instructions

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### Quick Start

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

- Backend: `http://localhost:3002`
- Frontend: `http://localhost:3001`
- API Docs: `http://localhost:3002/api` (Swagger)

## Deployment

**Frontend (Vercel):** ✅ Yes - Next.js is optimized for Vercel deployment  
**Backend (Vercel):** ❌ No - NestJS requires a long-running process (use Railway/Render/AWS instead)

See `DEPLOYMENT.md` for detailed deployment instructions.

## Approach & Tradeoffs

**Architecture:**
- Modular NestJS backend with feature-based modules (venues, booking-inquiries)
- Next.js App Router with server/client component separation
- Prisma ORM for type-safe database access
- PostgreSQL for production-ready data persistence

**Key Design Decisions:**
- **Prisma over TypeORM:** Better TypeScript integration and developer experience
- **Class-validator:** Declarative validation with decorators
- **Custom logger:** Simple structured logging sufficient for scope
- **Optimistic locking:** Prevents double bookings using version field and transaction-based conflict detection
- **No authentication:** Simplified scope for demo, would add JWT/OAuth in production
- **Pagination:** Implemented offset-based pagination with page/limit parameters
- **No caching:** Direct DB queries, would add Redis for production performance
- **Fixed city filters:** Frontend city picker is populated from the database to keep queries consistent; future work could add Elasticsearch for fuzzy text search across broader location metadata.

**Double Booking Prevention:**
Implemented optimistic locking with transaction-based conflict checking. Checks for overlapping date ranges within a database transaction to prevent race conditions.

## Improvements With More Time

**Backend:** Authentication (JWT), rate limiting, email service, API versioning, i18n for error message translations

**Caching:** Redis for query result caching, cache invalidation strategies, distributed caching for multi-instance deployments

**Frontend:** Date picker, image gallery, map integration, real-time validation, accessibility, component tests, i18n (internationalization) for multi-language support

**Environment Management:** Multiple environments (dev, staging, production), environment-specific configs and databases

**Configuration & Secrets:** HashiCorp Vault for secure secrets storage, dynamic configuration updates, secret rotation

**Feature Flags:** Flipper or LaunchDarkly for feature toggling, A/B testing, gradual rollouts

**DevOps & CI/CD:** GitHub Actions pipeline, automated testing/deployment, test coverage reporting, security scanning

**Monitoring:** APM (New Relic/Datadog), error tracking (Sentry), metrics (Prometheus/Grafana), uptime monitoring
