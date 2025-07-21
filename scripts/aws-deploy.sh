#!/bin/bash

# AWS Deployment Script for Pitch Analytics
# Usage: ./scripts/aws-deploy.sh [option]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="pitch-analytics"
AWS_REGION="us-east-1"
ECR_REPO_BACKEND="pitch-backend"
ECR_REPO_FRONTEND="pitch-frontend"
ECS_CLUSTER="pitch-cluster"
RDS_INSTANCE="pitch-db"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check AWS CLI
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        error "AWS CLI is not installed"
        info "Install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS CLI not configured"
        info "Run: aws configure"
        exit 1
    fi
    
    log "AWS CLI check passed"
}

# Get AWS account ID
get_account_id() {
    aws sts get-caller-identity --query Account --output text
}

# Setup ECR repositories
setup_ecr() {
    log "Setting up ECR repositories..."
    
    ACCOUNT_ID=$(get_account_id)
    ECR_URI="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
    
    # Create repositories if they don't exist
    aws ecr describe-repositories --repository-names $ECR_REPO_BACKEND 2>/dev/null || \
        aws ecr create-repository --repository-name $ECR_REPO_BACKEND
    
    aws ecr describe-repositories --repository-names $ECR_REPO_FRONTEND 2>/dev/null || \
        aws ecr create-repository --repository-name $ECR_REPO_FRONTEND
    
    # Login to ECR
    aws ecr get-login-password --region $AWS_REGION | \
        docker login --username AWS --password-stdin $ECR_URI
    
    echo "$ECR_URI"
}

# Build and push Docker images
build_and_push() {
    log "Building and pushing Docker images..."
    
    ECR_URI=$(setup_ecr)
    
    # Build backend
    log "Building backend image..."
    docker build -f backend/Dockerfile.prod -t $ECR_REPO_BACKEND ./backend
    docker tag $ECR_REPO_BACKEND:latest $ECR_URI/$ECR_REPO_BACKEND:latest
    docker push $ECR_URI/$ECR_REPO_BACKEND:latest
    
    # Build frontend
    log "Building frontend image..."
    docker build -f frontend/Dockerfile.prod -t $ECR_REPO_FRONTEND ./frontend
    docker tag $ECR_REPO_FRONTEND:latest $ECR_URI/$ECR_REPO_FRONTEND:latest
    docker push $ECR_URI/$ECR_REPO_FRONTEND:latest
    
    log "Images pushed successfully"
}

# Create ECS cluster
create_ecs_cluster() {
    log "Creating ECS cluster..."
    
    aws ecs create-cluster --cluster-name $ECS_CLUSTER 2>/dev/null || \
        log "Cluster already exists"
}

# Create RDS instance
create_rds() {
    log "Creating RDS instance..."
    
    # Check if RDS instance exists
    if aws rds describe-db-instances --db-instance-identifier $RDS_INSTANCE &>/dev/null; then
        log "RDS instance already exists"
        return
    fi
    
    # Generate secure password
    DB_PASSWORD=$(openssl rand -base64 16)
    
    # Create RDS instance
    aws rds create-db-instance \
        --db-instance-identifier $RDS_INSTANCE \
        --db-instance-class db.t3.micro \
        --engine postgres \
        --master-username postgres \
        --master-user-password "$DB_PASSWORD" \
        --allocated-storage 20 \
        --db-name presentation_app \
        --backup-retention-period 7 \
        --storage-encrypted \
        --deletion-protection
    
    log "RDS instance created with password: $DB_PASSWORD"
    warn "Save this password securely!"
}

# Create VPC and networking
create_networking() {
    log "Creating VPC and networking..."
    
    # Create VPC
    VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query Vpc.VpcId --output text)
    aws ec2 create-tags --resources $VPC_ID --tags Key=Name,Value=pitch-vpc
    
    # Create Internet Gateway
    IGW_ID=$(aws ec2 create-internet-gateway --query InternetGateway.InternetGatewayId --output text)
    aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID
    
    # Create public subnet
    SUBNET_ID=$(aws ec2 create-subnet \
        --vpc-id $VPC_ID \
        --cidr-block 10.0.1.0/24 \
        --availability-zone ${AWS_REGION}a \
        --query Subnet.SubnetId --output text)
    
    aws ec2 create-tags --resources $SUBNET_ID --tags Key=Name,Value=pitch-public-subnet
    
    # Create route table
    ROUTE_TABLE_ID=$(aws ec2 create-route-table --vpc-id $VPC_ID --query RouteTable.RouteTableId --output text)
    aws ec2 create-route --route-table-id $ROUTE_TABLE_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID
    aws ec2 associate-route-table --subnet-id $SUBNET_ID --route-table-id $ROUTE_TABLE_ID
    
    # Create security group
    SG_ID=$(aws ec2 create-security-group \
        --group-name pitch-app-sg \
        --description "Security group for Pitch application" \
        --vpc-id $VPC_ID \
        --query GroupId --output text)
    
    aws ec2 authorize-security-group-ingress \
        --group-id $SG_ID \
        --protocol tcp \
        --port 80 \
        --cidr 0.0.0.0/0
    
    aws ec2 authorize-security-group-ingress \
        --group-id $SG_ID \
        --protocol tcp \
        --port 443 \
        --cidr 0.0.0.0/0
    
    aws ec2 authorize-security-group-ingress \
        --group-id $SG_ID \
        --protocol tcp \
        --port 22 \
        --cidr 0.0.0.0/0
    
    log "Networking created: VPC=$VPC_ID, Subnet=$SUBNET_ID, SecurityGroup=$SG_ID"
}

# Deploy to ECS
deploy_ecs() {
    log "Deploying to ECS..."
    
    ACCOUNT_ID=$(get_account_id)
    ECR_URI="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
    
    # Create task definition
    cat > backend-task-definition.json << EOF
{
  "family": "pitch-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::$ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "$ECR_URI/$ECR_REPO_BACKEND:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://postgres:password@$RDS_INSTANCE.$AWS_REGION.rds.amazonaws.com:5432/presentation_app"
        },
        {
          "name": "SECRET_KEY",
          "value": "$(openssl rand -base64 32)"
        },
        {
          "name": "ENVIRONMENT",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/pitch-backend",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF
    
    # Register task definition
    aws ecs register-task-definition --cli-input-json file://backend-task-definition.json
    
    # Create service
    aws ecs create-service \
        --cluster $ECS_CLUSTER \
        --service-name pitch-backend \
        --task-definition pitch-backend:1 \
        --desired-count 2 \
        --launch-type FARGATE \
        --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxxxxxx],securityGroups=[sg-xxxxxxxxx],assignPublicIp=ENABLED}" \
        --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:$AWS_REGION:$ACCOUNT_ID:targetgroup/pitch-backend/xxxxxxxxx,containerName=backend,containerPort=8000" 2>/dev/null || \
        log "Service already exists"
    
    log "ECS deployment completed"
}

# Deploy to App Runner
deploy_app_runner() {
    log "Deploying to AWS App Runner..."
    
    # This would require AWS CLI v2 with App Runner support
    # For now, provide manual instructions
    info "To deploy to App Runner:"
    info "1. Go to AWS App Runner Console"
    info "2. Create new service"
    info "3. Connect your GitHub repository"
    info "4. Configure build settings"
    info "5. Add environment variables"
    info "6. Deploy"
}

# Deploy to EC2
deploy_ec2() {
    log "Deploying to EC2..."
    
    # Launch EC2 instance
    INSTANCE_ID=$(aws ec2 run-instances \
        --image-id ami-0c02fb55956c7d316 \
        --count 1 \
        --instance-type t3.medium \
        --key-name your-key-name \
        --security-group-ids sg-xxxxxxxxx \
        --subnet-id subnet-xxxxxxxxx \
        --query Instances[0].InstanceId --output text)
    
    log "EC2 instance created: $INSTANCE_ID"
    
    # Wait for instance to be running
    aws ec2 wait instance-running --instance-ids $INSTANCE_ID
    
    # Get public IP
    PUBLIC_IP=$(aws ec2 describe-instances \
        --instance-ids $INSTANCE_ID \
        --query Reservations[0].Instances[0].PublicIpAddress --output text)
    
    log "EC2 instance IP: $PUBLIC_IP"
    info "SSH to instance: ssh -i your-key.pem ubuntu@$PUBLIC_IP"
    info "Then run: git clone https://github.com/your-username/PitchVelo.git && cd PitchVelo && ./scripts/deploy.sh deploy"
}

# Monitor deployment
monitor() {
    log "Monitoring deployment..."
    
    # Check ECS services
    aws ecs describe-services --cluster $ECS_CLUSTER --services pitch-backend
    
    # Check RDS status
    aws rds describe-db-instances --db-instance-identifier $RDS_INSTANCE
    
    # Check ECR repositories
    aws ecr describe-repositories --repository-names $ECR_REPO_BACKEND $ECR_REPO_FRONTEND
}

# Cleanup resources
cleanup() {
    warn "This will delete all AWS resources. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        log "Cleaning up AWS resources..."
        
        # Delete ECS services
        aws ecs update-service --cluster $ECS_CLUSTER --service pitch-backend --desired-count 0
        aws ecs delete-service --cluster $ECS_CLUSTER --service pitch-backend
        
        # Delete ECS cluster
        aws ecs delete-cluster --cluster $ECS_CLUSTER
        
        # Delete RDS instance
        aws rds delete-db-instance --db-instance-identifier $RDS_INSTANCE --skip-final-snapshot
        
        # Delete ECR repositories
        aws ecr delete-repository --repository-name $ECR_REPO_BACKEND --force
        aws ecr delete-repository --repository-name $ECR_REPO_FRONTEND --force
        
        log "Cleanup completed"
    else
        log "Cleanup cancelled"
    fi
}

# Show help
show_help() {
    echo "AWS Deployment Script for Pitch Analytics"
    echo ""
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  setup          - Setup AWS infrastructure (VPC, RDS, ECS)"
    echo "  build          - Build and push Docker images to ECR"
    echo "  deploy-ecs     - Deploy to ECS Fargate"
    echo "  deploy-app-runner - Deploy to AWS App Runner"
    echo "  deploy-ec2     - Deploy to EC2"
    echo "  monitor        - Monitor deployment status"
    echo "  cleanup        - Clean up all AWS resources"
    echo "  help           - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup       # Setup infrastructure"
    echo "  $0 build       # Build and push images"
    echo "  $0 deploy-ecs  # Deploy to ECS"
    echo "  $0 monitor     # Check status"
}

# Main script logic
case "${1:-help}" in
    "setup")
        check_aws_cli
        create_networking
        create_rds
        create_ecs_cluster
        log "AWS infrastructure setup completed"
        ;;
    "build")
        check_aws_cli
        build_and_push
        ;;
    "deploy-ecs")
        check_aws_cli
        deploy_ecs
        ;;
    "deploy-app-runner")
        check_aws_cli
        deploy_app_runner
        ;;
    "deploy-ec2")
        check_aws_cli
        deploy_ec2
        ;;
    "monitor")
        check_aws_cli
        monitor
        ;;
    "cleanup")
        check_aws_cli
        cleanup
        ;;
    "help"|*)
        show_help
        ;;
esac 