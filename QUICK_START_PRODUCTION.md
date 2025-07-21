# 🚀 Quick Start: Production Deployment

## 📋 Overview
This guide will get your Pitch Analytics application running in production in under 30 minutes.

## 🎯 Recommended: Railway (Easiest)

### Step 1: Prepare Your Repository
```bash
# Make sure your code is pushed to GitHub
git add .
git commit -m "Production ready"
git push origin master
```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect your Docker setup

### Step 3: Configure Environment Variables
In Railway dashboard, add these environment variables:

```bash
# Database (Railway will provide this automatically)
DATABASE_URL=postgresql://postgres:password@postgres:5432/presentation_app

# Security (Generate these)
SECRET_KEY=your-super-secret-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app

# Optional: Monitoring
SENTRY_DSN=your-sentry-dsn
```

### Step 4: Deploy
- Railway will automatically build and deploy your application
- You'll get URLs for both frontend and backend
- Your app will be live in minutes!

---

## 🌐 Alternative: Render (Free Tier)

### Step 1: Deploy Backend
1. Go to [render.com](https://render.com)
2. Sign up and connect GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: `pitch-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`

### Step 2: Deploy Frontend
1. Click "New" → "Static Site"
2. Configure:
   - **Name**: `pitch-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `out`

### Step 3: Add Database
1. Click "New" → "PostgreSQL"
2. Create database
3. Update environment variables

---

## 🐳 Self-Hosted (Advanced)

### Prerequisites
- Server with Docker installed
- Domain name (optional)
- SSL certificates (optional)

### Step 1: Setup Server
```bash
# Clone repository
git clone https://github.com/your-username/PitchVelo.git
cd PitchVelo

# Copy environment file
cp env.production.example .env

# Edit environment variables
nano .env
```

### Step 2: Configure Environment
Edit `.env` file:
```bash
# Database
POSTGRES_PASSWORD=your-secure-password
DATABASE_URL=postgresql://postgres:your-secure-password@postgres:5432/presentation_app

# Security
SECRET_KEY=your-32-character-secret-key
REDIS_PASSWORD=your-redis-password

# Frontend
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# CORS
CORS_ORIGINS=https://yourdomain.com
```

### Step 3: Deploy
```bash
# Make script executable
chmod +x scripts/deploy.sh

# Deploy to production
./scripts/deploy.sh deploy

# Check status
./scripts/deploy.sh status

# Monitor
./scripts/deploy.sh monitor
```

---

## 🔧 Environment Variables Reference

### Required Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database
POSTGRES_PASSWORD=your-secure-password

# Security
SECRET_KEY=your-32-character-secret-key
REDIS_PASSWORD=your-redis-password

# Frontend
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Optional Variables
```bash
# Application
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
LOG_LEVEL=INFO

# CORS
CORS_ORIGINS=https://yourdomain.com

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

---

## 🚀 Deployment Commands

### Railway/Render (Automatic)
- Deployment happens automatically on git push
- No manual commands needed

### Self-Hosted
```bash
# Deploy
./scripts/deploy.sh deploy

# Check health
./scripts/deploy.sh health

# View logs
./scripts/deploy.sh logs

# Monitor
./scripts/deploy.sh monitor

# Backup
./scripts/deploy.sh backup

# Rollback
./scripts/deploy.sh rollback
```

---

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check if database is running
   docker-compose -f docker-compose.prod.yml ps
   
   # Check logs
   ./scripts/deploy.sh logs postgres
   ```

2. **Frontend Not Loading**
   ```bash
   # Check frontend logs
   ./scripts/deploy.sh logs frontend
   
   # Verify API URL
   echo $NEXT_PUBLIC_API_URL
   ```

3. **Backend Errors**
   ```bash
   # Check backend logs
   ./scripts/deploy.sh logs backend
   
   # Run health check
   curl http://localhost:8000/health
   ```

### Health Checks
```bash
# Application health
curl http://localhost:8000/health

# Frontend
curl http://localhost:3000

# Database
docker-compose -f docker-compose.prod.yml exec postgres pg_isready
```

---

## 📊 Monitoring

### Basic Monitoring
```bash
# Check service status
./scripts/deploy.sh status

# Monitor continuously
./scripts/deploy.sh monitor

# View resource usage
docker stats
```

### Advanced Monitoring
- Set up Sentry for error tracking
- Configure uptime monitoring
- Set up log aggregation
- Monitor database performance

---

## 🔒 Security Checklist

- [ ] Strong passwords generated
- [ ] SECRET_KEY is 32+ characters
- [ ] HTTPS enabled (Railway/Render do this automatically)
- [ ] CORS configured properly
- [ ] Database access restricted
- [ ] Regular backups enabled
- [ ] Monitoring set up

---

## 🎯 Next Steps

1. **Custom Domain**: Configure your domain name
2. **SSL Certificate**: Enable HTTPS (automatic on Railway/Render)
3. **Monitoring**: Set up Sentry and uptime monitoring
4. **Backups**: Configure automated backups
5. **Scaling**: Plan for traffic growth

---

## 📞 Support

- **Documentation**: Check the main README.md
- **Issues**: Create GitHub issues
- **Railway Support**: [railway.app/support](https://railway.app/support)
- **Render Support**: [render.com/docs](https://render.com/docs)

---

## ⚡ Quick Commands Reference

```bash
# Railway/Render (Automatic)
git push origin master  # Triggers deployment

# Self-Hosted
./scripts/deploy.sh deploy     # Deploy
./scripts/deploy.sh health     # Health check
./scripts/deploy.sh logs       # View logs
./scripts/deploy.sh backup     # Create backup
./scripts/deploy.sh rollback   # Rollback
./scripts/deploy.sh monitor    # Monitor
```

**Your application will be live in minutes!** 🚀 