# 🚀 AWS Quick Start Guide

## 📋 Overview
Quick deployment options for your Pitch Analytics application on AWS.

## 🎯 Recommended AWS Options

### **Option 1: AWS App Runner (Easiest - 10 minutes)**
### **Option 2: AWS ECS with Fargate (Recommended - 30 minutes)**
### **Option 3: AWS EC2 (Advanced - 45 minutes)**

---

## 🚀 Option 1: AWS App Runner (Easiest)

### Prerequisites
- AWS Account
- GitHub repository

### Step 1: Deploy Backend
1. **Go to AWS App Runner Console**
   - Navigate to [AWS App Runner](https://console.aws.amazon.com/apprunner)
   - Click "Create service"

2. **Configure Source**
   ```
   Source: GitHub
   Repository: your-username/PitchVelo
   Branch: master
   ```

3. **Configure Build Settings**
   ```
   Root directory: backend
   Build command: pip install -r requirements.txt
   Start command: gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   Port: 8000
   ```

4. **Add Environment Variables**
   ```bash
   DATABASE_URL=postgresql://postgres:password@your-rds-endpoint:5432/presentation_app
   SECRET_KEY=your-32-character-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ENVIRONMENT=production
   ```

5. **Create RDS Database**
   - Go to RDS Console
   - Create PostgreSQL instance (t3.micro)
   - Note the endpoint

6. **Deploy**
   - Click "Create & deploy"
   - Wait 5-10 minutes for deployment

### Step 2: Deploy Frontend
1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to S3 + CloudFront**
   - Create S3 bucket for static hosting
   - Upload build files
   - Create CloudFront distribution
   - Configure custom domain (optional)

---

## 🐳 Option 2: AWS ECS with Fargate (Recommended)

### Prerequisites
- AWS Account
- AWS CLI configured
- Docker installed

### Step 1: Setup AWS CLI
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS CLI
aws configure
```

### Step 2: Use Automated Script
```bash
# Make script executable
chmod +x scripts/aws-deploy.sh

# Setup infrastructure
./scripts/aws-deploy.sh setup

# Build and push images
./scripts/aws-deploy.sh build

# Deploy to ECS
./scripts/aws-deploy.sh deploy-ecs

# Monitor deployment
./scripts/aws-deploy.sh monitor
```

### Step 3: Manual ECS Deployment (Alternative)

1. **Create ECR Repositories**
   ```bash
   aws ecr create-repository --repository-name pitch-backend
   aws ecr create-repository --repository-name pitch-frontend
   ```

2. **Build and Push Images**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com

   # Build and push backend
   docker build -f backend/Dockerfile.prod -t pitch-backend ./backend
   docker tag pitch-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/pitch-backend:latest
   docker push your-account.dkr.ecr.us-east-1.amazonaws.com/pitch-backend:latest
   ```

3. **Create ECS Cluster**
   ```bash
   aws ecs create-cluster --cluster-name pitch-cluster
   ```

4. **Create RDS Database**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier pitch-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username postgres \
     --master-user-password your-secure-password \
     --allocated-storage 20 \
     --db-name presentation_app
   ```

5. **Deploy Service**
   - Use AWS Console or CLI
   - Create task definition
   - Create service
   - Configure load balancer

---

## 🖥️ Option 3: AWS EC2 (Advanced)

### Prerequisites
- AWS Account
- EC2 key pair

### Step 1: Launch EC2 Instance
```bash
# Launch Ubuntu 22.04 instance
# Instance type: t3.medium
# Security group: Allow ports 22, 80, 443, 8000, 3000
```

### Step 2: Setup Instance
```bash
# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 3: Deploy Application
```bash
# Clone repository
git clone https://github.com/your-username/PitchVelo.git
cd PitchVelo

# Copy environment file
cp env.production.example .env

# Edit environment variables
nano .env

# Deploy
./scripts/deploy.sh deploy
```

---

## 🔧 AWS Cost Estimation

### **AWS App Runner**
- **Backend**: ~$20-50/month
- **Database**: ~$15-30/month
- **Total**: ~$35-80/month

### **AWS ECS Fargate**
- **Backend**: ~$30-60/month
- **Database**: ~$15-30/month
- **Load Balancer**: ~$20/month
- **Total**: ~$65-110/month

### **AWS EC2**
- **Instance**: ~$30-60/month
- **Database**: ~$15-30/month
- **Total**: ~$45-90/month

---

## 🚀 Quick Commands

### **Using Automated Script**
```bash
# Setup everything
./scripts/aws-deploy.sh setup
./scripts/aws-deploy.sh build
./scripts/aws-deploy.sh deploy-ecs

# Monitor
./scripts/aws-deploy.sh monitor

# Cleanup
./scripts/aws-deploy.sh cleanup
```

### **Manual Commands**
```bash
# Build and push
docker build -f backend/Dockerfile.prod -t pitch-backend ./backend
docker tag pitch-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/pitch-backend:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/pitch-backend:latest

# Deploy
aws ecs update-service --cluster pitch-cluster --service pitch-backend --force-new-deployment
```

---

## 🔒 AWS Security Checklist

### **✅ Required**
- [ ] Strong database password
- [ ] SECRET_KEY (32+ characters)
- [ ] Security groups configured
- [ ] RDS encryption enabled
- [ ] IAM roles properly configured

### **🔧 Recommended**
- [ ] CloudWatch monitoring
- [ ] VPC with private subnets
- [ ] SSL certificates
- [ ] Automated backups
- [ ] CloudTrail logging

---

## 📊 AWS Monitoring

### **CloudWatch Setup**
```bash
# Create log groups
aws logs create-log-group --log-group-name /aws/ecs/pitch-backend
aws logs create-log-group --log-group-name /aws/ecs/pitch-frontend

# Create alarms
aws cloudwatch put-metric-alarm \
  --alarm-name pitch-cpu-alarm \
  --alarm-description "CPU utilization high" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

### **Health Checks**
```bash
# Check ECS services
aws ecs describe-services --cluster pitch-cluster --services pitch-backend

# Check RDS status
aws rds describe-db-instances --db-instance-identifier pitch-db

# Check ECR repositories
aws ecr describe-repositories --repository-names pitch-backend pitch-frontend
```

---

## 🎯 Recommended Strategy

### **For Beginners**
**AWS App Runner** - Easiest setup, automatic scaling, managed service

### **For Production**
**AWS ECS with Fargate** - Good balance of control and ease of use

### **For Cost Optimization**
**AWS EC2** - Most cost-effective for predictable workloads

### **For Enterprise**
**AWS EKS with Kubernetes** - Maximum control and scalability

---

## 📞 AWS Support

- **AWS Documentation**: [docs.aws.amazon.com](https://docs.aws.amazon.com)
- **AWS Support**: [aws.amazon.com/support](https://aws.amazon.com/support)
- **AWS Forums**: [forums.aws.amazon.com](https://forums.aws.amazon.com)
- **AWS Cost Calculator**: [calculator.aws](https://calculator.aws)

---

## ⚡ Quick Start Commands

```bash
# 1. Setup AWS CLI
aws configure

# 2. Use automated script
./scripts/aws-deploy.sh setup
./scripts/aws-deploy.sh build
./scripts/aws-deploy.sh deploy-ecs

# 3. Monitor deployment
./scripts/aws-deploy.sh monitor

# 4. Access your application
# Backend: https://your-alb-url
# Frontend: https://your-cloudfront-url
```

---

**🚀 Your application will be live on AWS in 10-45 minutes!**

**Time to deploy**: 10-45 minutes  
**Cost**: $35-110/month  
**Difficulty**: Easy to Advanced  
**Scalability**: Excellent 