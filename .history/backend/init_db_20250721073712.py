#!/usr/bin/env python3
"""
Database initialization script
Creates tables and adds initial admin user
"""

import asyncio
from sqlalchemy import create_engine
from database import engine
from models import Base
from auth import get_password_hash
from sqlalchemy.orm import sessionmaker

def init_database():
    """Initialize database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

def create_admin_user():
    """Create initial admin user"""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if admin user already exists
        from models import User
        admin_user = db.query(User).filter(User.email == "admin@example.com").first()
        
        if admin_user:
            print("✅ Admin user already exists!")
            return
        
        # Create admin user
        hashed_password = get_password_hash("admin123")
        admin_user = User(
            email="admin@example.com",
            username="admin",
            hashed_password=hashed_password,
            role="admin"
        )
        
        db.add(admin_user)
        db.commit()
        print("✅ Admin user created successfully!")
        print("   Email: admin@example.com")
        print("   Password: admin123")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """Main initialization function"""
    print("🚀 Initializing Presentation Analytics Database...")
    print("=" * 50)
    
    # Create tables
    init_database()
    
    # Create admin user
    create_admin_user()
    
    print("=" * 50)
    print("🎉 Database initialization complete!")
    print("\n📝 Next steps:")
    print("1. Start the application: docker-compose up")
    print("2. Access the frontend: http://localhost:3000")
    print("3. Login with admin@example.com / admin123")
    print("4. View API docs: http://localhost:8000/docs")

if __name__ == "__main__":
    main() 