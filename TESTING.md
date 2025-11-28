# Testing Guide

## Overview

The backend includes comprehensive test coverage with both unit tests and end-to-end (E2E) tests.

## Running Tests

### Unit Tests

```bash
cd backend

# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:cov
```

### E2E Tests

```bash
cd backend

# Run end-to-end tests
npm run test:e2e
```

## Test Structure

### Unit Tests

Located alongside the source files with `.spec.ts` extension.

#### VenuesService Tests (`src/modules/venues/venues.service.spec.ts`)

Tests the venue filtering logic:
- ✅ Returns all venues when no filters applied
- ✅ Filters venues by city
- ✅ Filters venues by minimum capacity
- ✅ Filters venues by maximum price
- ✅ Applies multiple filters simultaneously
- ✅ Logs operations correctly

**Coverage:** 100% of service methods

#### BookingInquiriesService Tests (`src/modules/booking-inquiries/booking-inquiries.service.spec.ts`)

Tests the booking inquiry creation and validation:
- ✅ Creates booking inquiry successfully
- ✅ Rejects inquiry when venue not found
- ✅ Rejects inquiry when attendee count exceeds venue capacity
- ✅ Accepts inquiry when attendee count equals venue capacity
- ✅ Logs operations and warnings correctly

**Coverage:** 100% of service methods including error paths

### E2E Tests

Located in `test/` directory with `.e2e-spec.ts` extension.

#### API Endpoints Tests (`test/app.e2e-spec.ts`)

Tests all API endpoints with real HTTP requests:

**GET /venues:**
- ✅ Returns all venues
- ✅ Filters by city parameter
- ✅ Filters by minCapacity parameter
- ✅ Filters by maxPrice parameter
- ✅ Returns empty array when no matches
- ✅ Rejects invalid query parameters (400)

**POST /booking-inquiries:**
- ✅ Creates booking inquiry with valid data (201)
- ✅ Rejects non-existent venue (400)
- ✅ Rejects when exceeding venue capacity (400)
- ✅ Rejects invalid email format (400)
- ✅ Rejects missing required fields (400)
- ✅ Rejects negative attendee count (400)

**Coverage:** All API endpoints and validation rules

## Test Configuration

### Jest Configuration (Unit Tests)

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": ["**/*.(t|j)s"],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node"
}
```

### Jest E2E Configuration

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
```

## Mocking Strategy

### Unit Tests

- **PrismaService:** Mocked to avoid database dependencies
- **LoggerService:** Mocked to verify logging behavior
- **Test Data:** Inline test fixtures for predictable results

### E2E Tests

- **Database:** Uses real Prisma connection (test database recommended)
- **HTTP:** Tests real HTTP requests using Supertest
- **Cleanup:** Automatic cleanup in afterAll hooks

## Coverage Goals

- **Unit Tests:** Aim for 80%+ coverage on business logic
- **E2E Tests:** Cover all API endpoints and common error scenarios
- **Integration:** Verify database interactions work correctly

## Best Practices

1. **Isolation:** Each test is independent and doesn't rely on others
2. **Cleanup:** E2E tests clean up test data after execution
3. **Descriptive:** Test names clearly describe what is being tested
4. **Arrange-Act-Assert:** Tests follow AAA pattern
5. **Fast:** Unit tests run quickly without external dependencies

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: |
    cd backend
    npm install
    npm run test
    npm run test:e2e
```

## Future Improvements

- [ ] Add test database seeding for E2E tests
- [ ] Implement integration tests for Prisma queries
- [ ] Add performance tests for large datasets
- [ ] Add contract tests for API versioning
- [ ] Implement mutation testing for better coverage
- [ ] Add visual regression tests for frontend

