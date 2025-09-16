# Production Deployment Guide

## 1. Vercel (Eng oson) ⭐

### Backend deploy:
1. Vercel.com ga kiring va GitHub bilan connect qiling
2. "Import Project" tugmasini bosing
3. `server` papkasini tanlang
4. Environment Variables ni qo'shing:
   - `DATABASE_URL`: PostgreSQL URL (Neon yoki Supabase dan)
   - `JWT_SECRET`: maxfiy kalit
   - `STRIPE_SECRET_KEY`: Stripe kaliti
   - `WEB_BASE_URL`: frontend URL

### Frontend deploy:
1. Yangi project yarating
2. `client` papkasini tanlang
3. Environment Variable:
   - `VITE_API_BASE`: backend URL

## 2. Railway (Docker bilan) 🚂

### Qadamlar:
1. Railway.app ga kiring
2. "New Project" → "Deploy from GitHub repo"
3. Root directory ni tanlang (Dockerfile mavjud)
4. PostgreSQL service qo'shing
5. Environment variables ni o'rnating

### Kerakli variables:
```
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your_secret_here
WEB_BASE_URL=${{RAILWAY_STATIC_URL}}
```

## 3. Render 🎨

### Qadamlar:
1. Render.com ga kiring
2. "New Web Service" yarating
3. Docker deployment tanlang
4. PostgreSQL database qo'shing

## 4. Digital Ocean / AWS (Professional) ☁️

### VPS orqali:
1. Ubuntu server yarating
2. Docker va Docker Compose o'rnating
3. SSL sertifikat sozlang (Let's Encrypt)
4. Nginx reverse proxy qo'ying

## Environment Variables

### Backend (.env):
```
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://neondb_owner:npg_gOS7txQwr2zI@ep-proud-fog-a1l7a4vu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=very_secure_secret_key
STRIPE_SECRET_KEY=sk_live_...
WEB_BASE_URL=https://ecosoiljdu-frontend.vercel.app

```

### Frontend (.env):
```
VITE_API_BASE=https://ecosoiljdu-backend.onrender.com
```

## Database Setup

### Neon PostgreSQL (Bepul):
1. Neon.tech ga kiring
2. Yangi project yarating
3. Connection string ni oling
4. Migrations ni run qiling

### Commands:
```bash
# Local build test
npm run deploy:local

# Docker build test  
docker build -t ecosoil .
docker run -p 4000:4000 ecosoil

# Production deploy
git push origin main
```

## Checklist ✅

- [ ] Database yaratildi va migrations run qilindi
- [ ] Environment variables sozlandi
- [ ] SSL sertifikat o'rnatildi
- [ ] File upload directory mavjud
- [ ] Stripe webhook endpoints sozlandi
- [ ] Domain DNS sozlamalari to'g'ri
- [ ] Backup strategiya belgilandi
