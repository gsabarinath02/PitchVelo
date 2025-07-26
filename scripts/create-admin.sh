#!/bin/bash

# Admin User Creation Script
# Usage: ./scripts/create-admin.sh [email] [password]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
DEFAULT_EMAIL="admin@veloscope.com"
DEFAULT_PASSWORD="veloadmin123"

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

# Show current admin credentials
show_current_admin() {
    log "Current Admin Credentials:"
    echo ""
    echo "📧 Email: admin@veloscope.com"
    echo "🔑 Password: veloadmin123"
    echo "👤 Username: admin"
    echo "🔐 Role: admin"
    echo ""
    echo "🌐 Login URL: http://localhost:3000/login"
    echo "📊 Admin Dashboard: http://localhost:3000/admin"
    echo "📚 API Documentation: http://localhost:8000/docs"
}

# Create custom admin user
create_custom_admin() {
    local email=${1:-$DEFAULT_EMAIL}
    local password=${2:-$DEFAULT_PASSWORD}
    
    log "Creating custom admin user..."
    
    # Check if Docker is running
    if ! docker-compose ps | grep -q "backend.*Up"; then
        error "Backend service is not running. Please start the application first:"
        echo "  docker-compose up -d"
        exit 1
    fi
    
    # Create Python script for custom admin
    cat > create_custom_admin.py << EOF
#!/usr/bin/env python3
import sys
import os
sys.path.append('/app')

from database import engine
from models import User
from auth import get_password_hash
from sqlalchemy.orm import sessionmaker

def create_custom_admin(email, password):
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        
        if existing_user:
            print(f"✅ User {email} already exists!")
            return
        
        # Create new admin user
        hashed_password = get_password_hash(password)
        admin_user = User(
            email=email,
            username=email.split('@')[0],
            hashed_password=hashed_password,
            role="admin"
        )
        
        db.add(admin_user)
        db.commit()
        print(f"✅ Custom admin user created successfully!")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"   Username: {email.split('@')[0]}")
        print(f"   Role: admin")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else "$email"
    password = sys.argv[2] if len(sys.argv) > 2 else "$password"
    create_custom_admin(email, password)
EOF
    
    # Execute the script in the backend container
    docker-compose exec backend python create_custom_admin.py
    
    # Clean up
    rm create_custom_admin.py
    
    log "Custom admin user created!"
}

# Change default admin password
change_admin_password() {
    local new_password=${1:-"newadmin123"}
    
    log "Changing default admin password..."
    
    # Check if Docker is running
    if ! docker-compose ps | grep -q "backend.*Up"; then
        error "Backend service is not running. Please start the application first:"
        echo "  docker-compose up -d"
        exit 1
    fi
    
    # Create Python script to change password
    cat > change_admin_password.py << EOF
#!/usr/bin/env python3
import sys
import os
sys.path.append('/app')

from database import engine
from models import User
from auth import get_password_hash
from sqlalchemy.orm import sessionmaker

def change_admin_password(new_password):
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Find admin user
        admin_user = db.query(User).filter(User.email == "admin@veloscope.com").first()
        
        if not admin_user:
            print("❌ Admin user not found!")
            return
        
        # Update password
        admin_user.hashed_password = get_password_hash(new_password)
        db.commit()
        
        print("✅ Admin password changed successfully!")
        print(f"   Email: admin@veloscope.com")
        print(f"   New Password: {new_password}")
        
    except Exception as e:
        print(f"❌ Error changing password: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    new_password = sys.argv[1] if len(sys.argv) > 1 else "$new_password"
    change_admin_password(new_password)
EOF
    
    # Execute the script in the backend container
    docker-compose exec backend python change_admin_password.py
    
    # Clean up
    rm change_admin_password.py
    
    log "Admin password changed!"
}

# List all admin users
list_admin_users() {
    log "Listing all admin users..."
    
    # Check if Docker is running
    if ! docker-compose ps | grep -q "backend.*Up"; then
        error "Backend service is not running. Please start the application first:"
        echo "  docker-compose up -d"
        exit 1
    fi
    
    # Create Python script to list admins
    cat > list_admin_users.py << EOF
#!/usr/bin/env python3
import sys
import os
sys.path.append('/app')

from database import engine
from models import User
from sqlalchemy.orm import sessionmaker

def list_admin_users():
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Find all admin users
        admin_users = db.query(User).filter(User.role == "admin").all()
        
        if not admin_users:
            print("❌ No admin users found!")
            return
        
        print("👥 Admin Users:")
        print("=" * 50)
        for user in admin_users:
            print(f"📧 Email: {user.email}")
            print(f"👤 Username: {user.username}")
            print(f"🔐 Role: {user.role}")
            print(f"📅 Created: {user.created_at}")
            print("-" * 30)
        
    except Exception as e:
        print(f"❌ Error listing admin users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_admin_users()
EOF
    
    # Execute the script in the backend container
    docker-compose exec backend python list_admin_users.py
    
    # Clean up
    rm list_admin_users.py
}

# Show help
show_help() {
    echo "Admin User Management Script"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  show                    - Show current admin credentials"
    echo "  create [email] [pass]   - Create custom admin user"
    echo "  change [new_password]   - Change default admin password"
    echo "  list                    - List all admin users"
    echo "  help                    - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 show                 # Show current credentials"
    echo "  $0 create               # Create custom admin with defaults"
    echo "  $0 create myadmin@example.com mypassword"
    echo "  $0 change newpassword123"
    echo "  $0 list                 # List all admin users"
    echo ""
    echo "Default Admin Credentials:"
    echo "  Email: admin@veloscope.com"
    echo "  Password: veloadmin123"
}

# Main script logic
case "${1:-show}" in
    "show")
        show_current_admin
        ;;
    "create")
        create_custom_admin "$2" "$3"
        ;;
    "change")
        change_admin_password "$2"
        ;;
    "list")
        list_admin_users
        ;;
    "help"|*)
        show_help
        ;;
esac 