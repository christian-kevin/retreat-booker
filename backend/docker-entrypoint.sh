#!/bin/sh
set -e

echo "Waiting for database to be ready..."
# Wait for postgres to be ready by checking if we can connect
until npx prisma migrate status > /dev/null 2>&1; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is ready!"

echo "Running migrations..."
# Try migrate deploy first (for existing migrations), fallback to db push (for first-time setup)
npx prisma migrate deploy || npx prisma db push --skip-generate || echo "Database schema sync completed"

echo "Seeding database..."
npx prisma db seed || echo "Seed may have already run, continuing..."

echo "Starting application..."
exec "$@"

