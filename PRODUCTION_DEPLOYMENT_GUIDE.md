# Production Deployment Guide
## Presentation Analytics Platform

**Version**: 2.0.0  
**Last Updated**: January 2025  
**Status**: ✅ PRODUCTION READY

---

## 🚀 Quick Start

### 1. Prerequisites
- Docker & Docker Compose installed
- Domain name configured
- SSL certificates ready
- Server with minimum 4GB RAM, 2 CPU cores

### 2. Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd Pitch

# Copy environment file
cp env.production.example .env

# Edit environment variables
nano .env

# Deploy to production
./scripts/deploy.sh deploy
```

### 3. Access Application
- **Frontend**: https://yourdomain.com
- **Backend API**: https://yourdomain.com/api
- **Health Check**: https://yourdomain.com/health
- **Metrics**: https://yourdomain.com/metrics

---

## 📋 Pre-Deployment Checklist

### ✅ Security Configuration
- [ ] Strong SECRET_KEY generated (32+ characters)
- [ ] Database password changed from default
- [ ] SSL certificates installed
- [ ] CORS origins configured for production domain
- [ ] Rate limiting enabled
- [ ] Security headers configured

### ✅ Infrastructure Setup
- [ ] Domain DNS configured
- [ ] Firewall rules configured
- [ ] SSL certificates obtained
- [ ] Backup storage configured
- [ ] Monitoring tools set up

### ✅ Application Configuration
- [ ] Environment variables set
- [ ] Database migrations ready
- [ ] Redis connection configured
- [ ] Logging level set to INFO
- [ ] Sentry DSN configured (optional)

---

## 🔧 Detailed Setup Instructions

### 1. Environment Configuration

Create `.env` file with production settings:

```env
# Database Configuration
POSTGRES_DB=presentation_app
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-super-secure-password-here

# Backend Configuration
SECRET_KEY=your-32-character-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
LOG_LEVEL=INFO

# Redis Configuration
REDIS_URL=redis://redis:6379

# CORS Configuration
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Monitoring (Optional)
SENTRY_DSN=https://your-sentry-dsn-here

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# Security
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

### 2. SSL Certificate Setup

For production, you need SSL certificates:

```bash
# Create SSL directory
mkdir -p nginx/ssl

# Copy your SSL certificates
cp your-certificate.pem nginx/ssl/cert.pem
cp your-private-key.pem nginx/ssl/key.pem

# Set proper permissions
chmod 600 nginx/ssl/key.pem
chmod 644 nginx/ssl/cert.pem
```

### 3. Database Setup

The application will automatically create the database, but you can pre-configure:

```bash
# Create database manually (optional)
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -c "CREATE DATABASE presentation_app;"

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head

# Initialize database
docker-compose -f docker-compose.prod.yml exec backend python init_db.py
```

---

## 🚀 Deployment Commands

### Initial Deployment
```bash
# Deploy to production
./scripts/deploy.sh deploy

# Check deployment status
./scripts/monitor.sh single
```

### Ongoing Operations
```bash
# Monitor application health
./scripts/monitor.sh continuous

# Create backup
./scripts/deploy.sh backup

# Check health
./scripts/deploy.sh health

# Rollback (if needed)
./scripts/deploy.sh rollback
```

---

## 🔒 Security Hardening

### 1. Network Security
```bash
# Configure firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 2. SSL/TLS Configuration
- Use strong SSL certificates (Let's Encrypt or commercial)
- Enable HTTP/2 and HTTP/3
- Configure security headers
- Enable HSTS

### 3. Application Security
- Rate limiting enabled
- Input validation
- SQL injection protection
- XSS protection
- CSRF protection

### 4. Database Security
- Strong passwords
- Network isolation
- Regular backups
- Access logging

---

## 📊 Monitoring & Observability

### 1. Health Checks
```bash
# Application health
curl https://yourdomain.com/health

# Database health
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Redis health
docker-compose -f docker-compose.prod.yml exec redis redis-cli ping
```

### 2. Metrics Collection
```bash
# Prometheus metrics
curl https://yourdomain.com/metrics

# Application logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. Performance Monitoring
```bash
# Resource usage
docker stats

# Database performance
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d presentation_app -c "SELECT * FROM pg_stat_activity;"
```

---

## 💾 Backup & Recovery

### 1. Automated Backups
```bash
# Create backup script
cat > /etc/cron.daily/backup-app << 'EOF'
#!/bin/bash
cd /path/to/your/app
./scripts/deploy.sh backup
EOF

chmod +x /etc/cron.daily/backup-app
```

### 2. Manual Backup
```bash
# Database backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres presentation_app > backup_$(date +%Y%m%d_%H%M%S).sql

# Application backup
tar -czf app_backup_$(date +%Y%m%d_%H%M%S).tar.gz . --exclude=node_modules --exclude=.git
```

### 3. Recovery Procedures
```bash
# Restore database
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres presentation_app < backup_file.sql

# Restore application
tar -xzf app_backup_file.tar.gz
```

---

## 🔧 Maintenance Procedures

### 1. Regular Maintenance
```bash
# Weekly tasks
- Check disk space
- Review logs for errors
- Verify backup integrity
- Update security patches

# Monthly tasks
- Performance review
- Security audit
- Update dependencies
- Capacity planning
```

### 2. Update Procedures
```bash
# Application update
git pull origin main
./scripts/deploy.sh deploy

# Dependency updates
docker-compose -f docker-compose.prod.yml build --no-cache
./scripts/deploy.sh deploy
```

### 3. Troubleshooting
```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs [service_name]

# Restart service
docker-compose -f docker-compose.prod.yml restart [service_name]
```

---

## 📈 Performance Optimization

### 1. Application Level
- Enable Redis caching
- Optimize database queries
- Use CDN for static assets
- Implement connection pooling

### 2. Infrastructure Level
- Use load balancers
- Implement auto-scaling
- Optimize container resources
- Use SSD storage

### 3. Monitoring Alerts
```bash
# Set up monitoring alerts for:
- High CPU usage (>80%)
- High memory usage (>85%)
- Disk space low (<10%)
- Service down
- High error rate (>5%)
```

---

## 🛡️ Security Best Practices

### 1. Access Control
- Use strong passwords
- Implement 2FA for admin access
- Regular access reviews
- Principle of least privilege

### 2. Data Protection
- Encrypt data at rest
- Encrypt data in transit
- Regular security audits
- GDPR compliance

### 3. Incident Response
```bash
# Security incident checklist:
1. Isolate affected systems
2. Assess impact
3. Contain threat
4. Eradicate threat
5. Recover systems
6. Document incident
7. Review and improve
```

---

## 📞 Support & Troubleshooting

### Common Issues

#### 1. Application Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check environment variables
docker-compose -f docker-compose.prod.yml config

# Verify dependencies
docker-compose -f docker-compose.prod.yml exec backend python -c "import redis; print('Redis OK')"
```

#### 2. Database Connection Issues
```bash
# Check database status
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Check connection string
docker-compose -f docker-compose.prod.yml exec backend python -c "from database import engine; print('DB OK')"
```

#### 3. SSL Certificate Issues
```bash
# Check certificate validity
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Test SSL connection
curl -I https://yourdomain.com
```

### Support Contacts
- **Technical Issues**: Create GitHub issue
- **Security Issues**: Security team contact
- **Emergency**: On-call engineer

---

## 📚 Additional Resources

### Documentation
- [API Documentation](https://yourdomain.com/docs)
- [User Guide](USER_ONBOARDING_AND_ANALYTICS_GUIDE.md)
- [Test Cases](TEST_CASES.md)

### Monitoring Tools
- Prometheus + Grafana
- Sentry for error tracking
- ELK Stack for log analysis

### Security Tools
- OWASP ZAP for security testing
- SonarQube for code quality
- Snyk for dependency scanning

---

## ✅ Production Checklist

### Pre-Launch
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Performance testing done
- [ ] Backup strategy implemented
- [ ] Monitoring configured
- [ ] SSL certificates installed
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Health checks passing

### Post-Launch
- [ ] Application accessible
- [ ] All features working
- [ ] Monitoring alerts configured
- [ ] Backup verification
- [ ] Performance baseline established
- [ ] Security monitoring active
- [ ] Documentation updated
- [ ] Team trained on procedures

---

**Note**: This guide assumes a Linux/Unix environment. For Windows deployments, some commands may need adjustment.

**Last Updated**: January 2025  
**Next Review**: February 2025 