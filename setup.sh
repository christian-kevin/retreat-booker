#!/bin/bash

echo "🚀 Setting up Retreat Venue Management System..."

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo ""
echo "📝 Creating backend .env file..."
cp .env.example .env

echo ""
echo "🐘 Starting PostgreSQL..."
docker-compose up -d postgres

echo ""
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

echo ""
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init

echo ""
echo "🌱 Seeding database..."
npx prisma db seed

echo ""
echo "📦 Installing frontend dependencies..."
cd ../web
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  Backend:  cd backend && npm run start:dev"
echo "  Frontend: cd web && npm run dev"
echo ""
echo "Or use Docker:"
echo "  docker-compose up"
echo ""
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:3001"

