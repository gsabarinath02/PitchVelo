# 🚀 AWS Deployment Guide

## 📋 Overview
This guide covers multiple AWS deployment options for your Pitch Analytics application, from simple to enterprise-grade.

## 🎯 AWS Deployment Options

### Option 1: AWS App Runner (Easiest)
### Option 2: AWS ECS with Fargate (Recommended)
### Option 3: AWS EC2 with Docker (Advanced)
### Option 4: AWS EKS with Kubernetes (Enterprise)

---

## 🚀 Option 1: AWS App Runner (Easiest)

### Prerequisites
- AWS Account
- AWS CLI configured
- GitHub repository

### Step 1: Prepare Your Application

```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "AWS App Runner ready"
git push origin master
```

### Step 2: Create App Runner Service

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
   Build command: pip install -r backend/requirements.txt
   Start command: gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   Port: 8000
   ```

4. **Configure Environment Variables**
   ```bash
   DATABASE_URL=postgresql://postgres:password@your-rds-endpoint:5432/presentation_app
   SECRET_KEY=your-32-character-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ENVIRONMENT=production
   ```

5. **Create RDS Database**
   - Go to RDS Console
   - Create PostgreSQL instance
   - Note the endpoint for DATABASE_URL

6. **Deploy**
   - Click "Create & deploy"
   - App Runner will build and deploy automatically

### Step 3: Deploy Frontend (Static Site)

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
- Docker installed locally

### Step 1: Setup AWS Infrastructure

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS CLI
aws configure
```

### Step 2: Create ECR Repositories

```bash
# Create repositories
aws ecr create-repository --repository-name pitch-backend
aws ecr create-repository --repository-name pitch-frontend

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
```

### Step 3: Build and Push Docker Images

```bash
# Build backend image
docker build -f backend/Dockerfile.prod -t pitch-backend ./backend
docker tag pitch-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/pitch-backend:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/pitch-backend:latest

# Build frontend image
docker build -f frontend/Dockerfile.prod -t pitch-frontend ./frontend
docker tag pitch-frontend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/pitch-frontend:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/pitch-frontend:latest
```

### Step 4: Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster --cluster-name pitch-cluster
```

### Step 5: Create Task Definitions

Create `backend-task-definition.json`:
```json
{
  "family": "pitch-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::your-account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-account.dkr.ecr.us-east-1.amazonaws.com/pitch-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://postgres:password@your-rds-endpoint:5432/presentation_app"
        },
        {
          "name": "SECRET_KEY",
          "value": "your-32-character-secret-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/pitch-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Step 6: Create RDS Database

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier pitch-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password your-secure-password \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-name presentation_app
```

### Step 7: Create Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name pitch-alb \
  --subnets subnet-xxxxxxxxx subnet-yyyyyyyyy \
  --security-groups sg-xxxxxxxxx
```

### Step 8: Deploy Services

```bash
# Register task definition
aws ecs register-task-definition --cli-input-json file://backend-task-definition.json

# Create service
aws ecs create-service \
  --cluster pitch-cluster \
  --service-name pitch-backend \
  --task-definition pitch-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxxxxx],securityGroups=[sg-xxxxxxxxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:your-account:targetgroup/pitch-backend/xxxxxxxxx,containerName=backend,containerPort=8000"
```

---

## 🖥️ Option 3: AWS EC2 with Docker (Advanced)

### Prerequisites
- AWS Account
- EC2 instance with Docker installed

### Step 1: Launch EC2 Instance

```bash
# Launch Ubuntu 22.04 instance
# Instance type: t3.medium or larger
# Security group: Allow ports 22, 80, 443, 8000, 3000
```

### Step 2: Setup EC2 Instance

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

# Install Nginx
sudo apt install nginx -y
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

### Step 4: Configure Nginx

Create `/etc/nginx/sites-available/pitch`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/pitch /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## ☸️ Option 4: AWS EKS with Kubernetes (Enterprise)

### Prerequisites
- AWS Account
- kubectl installed
- eksctl installed

### Step 1: Create EKS Cluster

```bash
# Create cluster
eksctl create cluster \
  --name pitch-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed
```

### Step 2: Create Kubernetes Manifests

Create `k8s/namespace.yaml`:
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: pitch-app
```

Create `k8s/postgres.yaml`:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: pitch-app
spec:
  ports:
  - port: 5432
  selector:
    app: postgres
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: pitch-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_DB
          value: "presentation_app"
        - name: POSTGRES_USER
          value: "postgres"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        ports:
        - containerPort: 5432
```

Create `k8s/backend.yaml`:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: pitch-app
spec:
  ports:
  - port: 8000
  selector:
    app: backend
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: pitch-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-account.dkr.ecr.us-east-1.amazonaws.com/pitch-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          value: "postgresql://postgres:$(POSTGRES_PASSWORD)@postgres:5432/presentation_app"
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: secret-key
```

### Step 3: Deploy to Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml

# Check status
kubectl get pods -n pitch-app
kubectl get services -n pitch-app
```

---

## 🔧 AWS Infrastructure as Code (Terraform)

### Prerequisites
- Terraform installed
- AWS credentials configured

### Step 1: Create Terraform Configuration

Create `terraform/main.tf`:
```hcl
provider "aws" {
  region = "us-east-1"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "pitch-vpc"
  }
}

# Subnets
resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  
  tags = {
    Name = "pitch-public-subnet"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "pitch-cluster"
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier           = "pitch-db"
  engine              = "postgres"
  engine_version      = "15"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  storage_type        = "gp2"
  username            = "postgres"
  password            = var.db_password
  db_name             = "presentation_app"
  skip_final_snapshot = true
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "pitch-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [aws_subnet.public.id]
}

# Security Groups
resource "aws_security_group" "alb" {
  name        = "pitch-alb-sg"
  description = "ALB Security Group"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### Step 2: Deploy with Terraform

```bash
# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Apply configuration
terraform apply
```

---

## 🔒 AWS Security Best Practices

### 1. IAM Configuration
```bash
# Create IAM user for deployment
aws iam create-user --user-name pitch-deploy

# Attach necessary policies
aws iam attach-user-policy \
  --user-name pitch-deploy \
  --policy-arn arn:aws:iam::aws:policy/AmazonECS-FullAccess

aws iam attach-user-policy \
  --user-name pitch-deploy \
  --policy-arn arn:aws:iam::aws:policy/AmazonRDSFullAccess
```

### 2. Security Groups
```bash
# Create security group for application
aws ec2 create-security-group \
  --group-name pitch-app-sg \
  --description "Security group for Pitch application"

# Allow necessary ports
aws ec2 authorize-security-group-ingress \
  --group-name pitch-app-sg \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name pitch-app-sg \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

### 3. Secrets Management
```bash
# Store secrets in AWS Secrets Manager
aws secretsmanager create-secret \
  --name pitch-app-secrets \
  --description "Secrets for Pitch application" \
  --secret-string '{"SECRET_KEY":"your-secret-key","DB_PASSWORD":"your-db-password"}'
```

---

## 📊 AWS Monitoring & Logging

### 1. CloudWatch Setup
```bash
# Create CloudWatch log group
aws logs create-log-group --log-group-name /aws/ecs/pitch-backend
aws logs create-log-group --log-group-name /aws/ecs/pitch-frontend
```

### 2. CloudWatch Alarms
```bash
# Create CPU alarm
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

### 3. Application Load Balancer Monitoring
```bash
# Enable access logging
aws elbv2 modify-load-balancer-attributes \
  --load-balancer-arn your-alb-arn \
  --attributes Key=access_logs.s3.enabled,Value=true
```

---

## 💰 AWS Cost Optimization

### 1. Reserved Instances
```bash
# Purchase reserved instances for predictable workloads
aws ec2 describe-reserved-instances-offerings \
  --instance-type t3.medium \
  --product-description "Linux/UNIX" \
  --offering-type "Partial Upfront"
```

### 2. Auto Scaling
```bash
# Create auto scaling group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name pitch-asg \
  --min-size 1 \
  --max-size 10 \
  --desired-capacity 2 \
  --vpc-zone-identifier subnet-xxxxxxxxx
```

### 3. Spot Instances (for non-critical workloads)
```bash
# Use spot instances for cost savings
aws ec2 request-spot-instances \
  --spot-price "0.05" \
  --instance-count 1 \
  --type "one-time" \
  --launch-specification file://spot-spec.json
```

---

## 🚀 Quick AWS Deployment Commands

### ECS Deployment
```bash
# Build and push images
docker build -f backend/Dockerfile.prod -t pitch-backend ./backend
docker tag pitch-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/pitch-backend:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/pitch-backend:latest

# Deploy to ECS
aws ecs update-service --cluster pitch-cluster --service pitch-backend --force-new-deployment
```

### EC2 Deployment
```bash
# Deploy to EC2
ssh ubuntu@your-ec2-ip "cd PitchVelo && git pull && ./scripts/deploy.sh deploy"
```

### Kubernetes Deployment
```bash
# Deploy to EKS
kubectl apply -f k8s/
kubectl rollout status deployment/backend -n pitch-app
```

---

## 🔍 Troubleshooting AWS Deployment

### Common Issues

1. **ECS Service Not Starting**
   ```bash
   # Check service events
   aws ecs describe-services --cluster pitch-cluster --services pitch-backend
   
   # Check task logs
   aws logs describe-log-streams --log-group-name /aws/ecs/pitch-backend
   ```

2. **RDS Connection Issues**
   ```bash
   # Check RDS status
   aws rds describe-db-instances --db-instance-identifier pitch-db
   
   # Test connection
   psql -h your-rds-endpoint -U postgres -d presentation_app
   ```

3. **Load Balancer Health Checks Failing**
   ```bash
   # Check target group health
   aws elbv2 describe-target-health --target-group-arn your-target-group-arn
   
   # Check security groups
   aws ec2 describe-security-groups --group-names pitch-app-sg
   ```

---

## 📞 AWS Support Resources

- **AWS Documentation**: [docs.aws.amazon.com](https://docs.aws.amazon.com)
- **AWS Support**: [aws.amazon.com/support](https://aws.amazon.com/support)
- **AWS Forums**: [forums.aws.amazon.com](https://forums.aws.amazon.com)
- **AWS Cost Calculator**: [calculator.aws](https://calculator.aws)

---

## 🎯 Recommended AWS Strategy

### **For Startups/MVPs**
**AWS App Runner** - Easiest setup, automatic scaling, managed service

### **For Production**
**AWS ECS with Fargate** - Good balance of control and ease of use

### **For Enterprise**
**AWS EKS with Kubernetes** - Maximum control and scalability

### **For Cost Optimization**
**AWS EC2 with Docker** - Most cost-effective for predictable workloads

---

**🚀 Your application is ready for AWS deployment! Choose the option that best fits your needs and budget.** 