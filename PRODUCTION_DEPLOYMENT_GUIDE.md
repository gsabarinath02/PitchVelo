# 🚀 Production Deployment Guide

## 📋 Overview
This guide will help you deploy your Pitch Analytics application to production with multiple hosting options.

## 🎯 Quick Start Options

### Option 1: Railway (Recommended - Easiest)
### Option 2: Render
### Option 3: DigitalOcean App Platform
### Option 4: AWS/GCP/Azure (Advanced)

---

## 🚂 Option 1: Railway Deployment (Recommended)

### Prerequisites
- GitHub account
- Railway account (railway.app)

### Steps:

1. **Fork/Clone Repository**
   ```bash
   git clone https://github.com/your-username/PitchVelo.git
   cd PitchVelo
   ```

2. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure Environment Variables**
   ```bash
   # In Railway dashboard, add these environment variables:
   DATABASE_URL=postgresql://postgres:password@postgres:5432/presentation_app
   SECRET_KEY=your-super-secret-key-change-this
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```

4. **Deploy**
   - Railway will automatically detect the Docker setup
   - It will build and deploy your application
   - You'll get URLs for both frontend and backend

---

## 🌐 Option 2: Render Deployment

### Prerequisites
- Render account (render.com)
- GitHub repository

### Steps:

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub account

2. **Deploy Backend**
   - Go to Dashboard → "New" → "Web Service"
   - Connect your GitHub repo
   - Configure:
     - **Name**: `pitch-backend`
     - **Root Directory**: `backend`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
   - Add environment variables:
     ```
     DATABASE_URL=postgresql://postgres:password@postgres:5432/presentation_app
     SECRET_KEY=your-super-secret-key-change-this
     ALGORITHM=HS256
     ACCESS_TOKEN_EXPIRE_MINUTES=30
     ```

3. **Deploy Frontend**
   - Go to Dashboard → "New" → "Static Site"
   - Configure:
     - **Name**: `pitch-frontend`
     - **Root Directory**: `frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `out`
   - Add environment variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
     ```

4. **Add PostgreSQL Database**
   - Go to Dashboard → "New" → "PostgreSQL"
   - Create database and update `DATABASE_URL`

---

## 🐳 Option 3: DigitalOcean App Platform

### Prerequisites
- DigitalOcean account
- GitHub repository

### Steps:

1. **Create App**
   - Go to DigitalOcean App Platform
   - Click "Create App" → "GitHub"
   - Select your repository

2. **Configure Services**
   - **Backend Service**:
     - Source: `backend/`
     - Build Command: `pip install -r requirements.txt`
     - Run Command: `gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
   
   - **Frontend Service**:
     - Source: `frontend/`
     - Build Command: `npm install && npm run build`
     - Output Directory: `out`

3. **Add Database**
   - Add PostgreSQL database
   - Update environment variables

---

## ☁️ Option 4: AWS/GCP/Azure (Advanced)

### AWS Deployment

1. **Setup AWS CLI**
   ```bash
   aws configure
   ```

2. **Deploy with ECS**
   ```bash
   # Build and push Docker images
   docker build -t pitch-backend ./backend
   docker build -t pitch-frontend ./frontend
   
   # Push to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
   docker tag pitch-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/pitch-backend:latest
   docker push your-account.dkr.ecr.us-east-1.amazonaws.com/pitch-backend:latest
   ```

3. **Create ECS Cluster**
   - Use AWS Console or CloudFormation
   - Configure load balancer and auto-scaling

---

## 🔧 Production Configuration

### Environment Variables

Create a `.env.production` file:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Security
SECRET_KEY=your-super-secret-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Configuration
CORS_ORIGINS=https://your-frontend-domain.com
API_V1_STR=/api/v1

# Frontend
NEXT_PUBLIC_API_URL=https://your-backend-domain.com

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

### Security Checklist

- [ ] Change default passwords
- [ ] Use strong SECRET_KEY
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring (Sentry)
- [ ] Enable rate limiting
- [ ] Set up backups

### Performance Optimization

1. **Database**
   ```sql
   -- Add indexes
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_submissions_created_at ON submissions(created_at);
   ```

2. **Frontend**
   ```bash
   # Optimize images
   npm install sharp
   
   # Enable compression
   # Add to next.config.js
   ```

3. **Backend**
   ```python
   # Add caching
   from fastapi_cache import FastAPICache
   from fastapi_cache.backends.redis import RedisBackend
   ```

---

## 📊 Monitoring & Analytics

### Setup Monitoring

1. **Sentry Integration**
   ```python
   import sentry_sdk
   from sentry_sdk.integrations.fastapi import FastApiIntegration
   
   sentry_sdk.init(
       dsn="your-sentry-dsn",
       integrations=[FastApiIntegration()],
       traces_sample_rate=1.0,
   )
   ```

2. **Health Checks**
   ```python
   @app.get("/health")
   async def health_check():
       return {"status": "healthy", "timestamp": datetime.utcnow()}
   ```

3. **Logging**
   ```python
   import structlog
   
   logger = structlog.get_logger()
   logger.info("Application started", version="1.0.0")
   ```

---

## 🚀 Quick Deploy Script

Create a deployment script:

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Starting deployment..."

# Build images
docker-compose -f docker-compose.prod.yml build

# Push to registry
docker push your-registry/pitch-backend:latest
docker push your-registry/pitch-frontend:latest

# Deploy
kubectl apply -f k8s/

echo "✅ Deployment complete!"
```

---

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection**
   ```bash
   # Check database connectivity
   psql $DATABASE_URL -c "SELECT 1;"
   ```

2. **Frontend Build Issues**
   ```bash
   # Clear cache
   rm -rf frontend/.next
   npm run build
   ```

3. **Backend Issues**
   ```bash
   # Check logs
   docker-compose logs backend
   
   # Restart services
   docker-compose restart
   ```

---

## 📞 Support

- **Documentation**: Check the README.md
- **Issues**: Create GitHub issues
- **Discussions**: Use GitHub Discussions

---

## 🎯 Recommended Hosting Choice

**For beginners**: Use **Railway** - it's the easiest and most straightforward option.

**For production**: Use **DigitalOcean App Platform** or **AWS** for better control and scalability.

**For cost optimization**: Use **Render** - it has a generous free tier.

Choose based on your needs:
- **Railway**: Easiest setup, good for MVPs
- **Render**: Good free tier, simple deployment
- **DigitalOcean**: Good balance of ease and control
- **AWS/GCP/Azure**: Maximum control, enterprise features 