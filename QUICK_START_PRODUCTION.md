# Quick Start: Production Deployment
## Presentation Analytics Platform

**Time to Deploy**: ~15 minutes  
**Difficulty**: Easy  
**Status**: ✅ Ready to Deploy

---

## 🚀 5-Minute Setup

### Step 1: Environment Setup
```bash
# Clone and setup
git clone <repository-url>
cd Pitch

# Copy environment file
cp env.production.example .env

# Edit environment variables (IMPORTANT!)
nano .env
```

### Step 2: Configure Environment Variables
Edit `.env` file with your production values:

```env
# REQUIRED: Change these values
POSTGRES_PASSWORD=your-super-secure-password-here
SECRET_KEY=your-32-character-secret-key-here
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# OPTIONAL: For SSL certificates
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem
```

### Step 3: Deploy to Production
```bash
# Deploy with one command
./scripts/deploy.sh deploy

# Check deployment status
./scripts/monitor.sh single
```

### Step 4: Access Your Application
- **Frontend**: https://yourdomain.com
- **Backend API**: https://yourdomain.com/api
- **Health Check**: https://yourdomain.com/health
- **API Docs**: https://yourdomain.com/docs

---

## 🔧 Advanced Setup (Optional)

### SSL Certificates
```bash
# Create SSL directory
mkdir -p nginx/ssl

# Copy your certificates
cp your-cert.pem nginx/ssl/cert.pem
cp your-key.pem nginx/ssl/key.pem

# Set permissions
chmod 600 nginx/ssl/key.pem
chmod 644 nginx/ssl/cert.pem
```

### Custom Domain
```bash
# Update your DNS to point to your server
# A record: yourdomain.com → your-server-ip
# A record: www.yourdomain.com → your-server-ip
```

### Firewall Setup
```bash
# Allow necessary ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

---

## 📊 Monitoring Your Application

### Health Checks
```bash
# Check application health
curl https://yourdomain.com/health

# Monitor continuously
./scripts/monitor.sh continuous

# Check resource usage
docker stats
```

### Logs
```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

---

## 🔒 Security Checklist

### ✅ Required Security Steps
- [ ] Changed default database password
- [ ] Generated strong SECRET_KEY (32+ characters)
- [ ] Configured CORS for your domain
- [ ] Set up SSL certificates
- [ ] Configured firewall rules

### ✅ Optional Security Enhancements
- [ ] Set up monitoring alerts
- [ ] Configure automated backups
- [ ] Enable rate limiting
- [ ] Set up security scanning

---

## 🛠️ Common Operations

### Start/Stop Services
```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### Backup & Recovery
```bash
# Create backup
./scripts/deploy.sh backup

# Restore from backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres presentation_app < backup_file.sql
```

### Updates
```bash
# Update application
git pull origin main
./scripts/deploy.sh deploy

# Update dependencies
docker-compose -f docker-compose.prod.yml build --no-cache
./scripts/deploy.sh deploy
```

---

## 🚨 Troubleshooting

### Application Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check environment
docker-compose -f docker-compose.prod.yml config

# Restart services
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### Database Issues
```bash
# Check database status
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Reset database (WARNING: loses data)
docker-compose -f docker-compose.prod.yml exec backend python init_db.py
```

### SSL Issues
```bash
# Check certificate
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Test SSL
curl -I https://yourdomain.com
```

---

## 📞 Support

### Quick Help
- **Documentation**: [Production Deployment Guide](PRODUCTION_DEPLOYMENT_GUIDE.md)
- **API Docs**: https://yourdomain.com/docs
- **Health Check**: https://yourdomain.com/health

### Emergency Commands
```bash
# Emergency restart
docker-compose -f docker-compose.prod.yml down && docker-compose -f docker-compose.prod.yml up -d

# Check all services
docker-compose -f docker-compose.prod.yml ps

# View recent logs
docker-compose -f docker-compose.prod.yml logs --tail=100
```

---

## ✅ Success Checklist

### After Deployment
- [ ] Application accessible at https://yourdomain.com
- [ ] Health check returns "healthy"
- [ ] API documentation accessible
- [ ] Database connection working
- [ ] SSL certificate valid
- [ ] Monitoring script running
- [ ] Backup system working

### Performance Check
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No errors in logs
- [ ] Resource usage reasonable

---

## 🎯 Next Steps

### Immediate (Day 1)
1. ✅ Deploy application
2. ✅ Test all features
3. ✅ Set up monitoring
4. ✅ Configure backups

### Short-term (Week 1)
1. 🔄 Set up alerting
2. 🔄 Performance testing
3. 🔄 Security audit
4. 🔄 Team training

### Long-term (Month 1)
1. 🔄 Load testing
2. 🔄 Advanced monitoring
3. 🔄 CI/CD pipeline
4. 🔄 Multi-region deployment

---

**🎉 Congratulations!** Your application is now production-ready and deployed.

**Need help?** Check the [Production Deployment Guide](PRODUCTION_DEPLOYMENT_GUIDE.md) for detailed instructions. 