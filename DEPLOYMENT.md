# Deployment Guide

## Quick Deploy Options

### Frontend (Vercel) - Recommended

1. **Push to GitHub**
```bash
git push origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Set root directory to `web`
- Add environment variable:
  - `NEXT_PUBLIC_API_URL` = your backend URL

3. **Deploy**
```bash
cd web
vercel --prod
```

### Backend (Railway) - Recommended

1. **Push to GitHub**
```bash
git push origin main
```

2. **Deploy to Railway**
- Go to [railway.app](https://railway.app)
- Create new project from GitHub repo
- Set root directory to `backend`
- Add PostgreSQL database
- Add environment variable:
  - `DATABASE_URL` = provided by Railway PostgreSQL

3. **Run migrations**
```bash
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

### Alternative: Render

**Backend:**
- Create new Web Service
- Root directory: `backend`
- Build: `npm install && npx prisma generate`
- Start: `npm run start:prod`
- Add PostgreSQL database

**Frontend:**
- Create new Static Site
- Root directory: `web`
- Build: `npm install && npm run build`
- Publish directory: `.next`

### Docker Deployment (VPS/DigitalOcean)

1. **Setup VPS**
```bash
# Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

2. **Clone and Deploy**
```bash
git clone <your-repo>
cd retreat
docker-compose up -d
```

3. **Setup Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
    }

    location /api {
        proxy_pass http://localhost:3000;
    }
}
```

## Environment Variables

### Backend
```env
DATABASE_URL=postgresql://user:password@host:5432/db
PORT=3000
```

### Frontend
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

## Post-Deployment

1. **Run migrations**
```bash
npx prisma migrate deploy
```

2. **Seed database**
```bash
npx prisma db seed
```

3. **Test endpoints**
```bash
curl https://api.your-domain.com/venues
```

## Monitoring

- **Vercel**: Built-in analytics
- **Railway**: Built-in logs and metrics
- **Self-hosted**: Add Sentry for error tracking

## SSL/HTTPS

- Vercel: Automatic
- Railway: Automatic
- Self-hosted: Use Let's Encrypt with Certbot

