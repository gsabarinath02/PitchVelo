#!/usr/bin/env python3
"""
Database reset script
Drops all tables and recreates them with fresh data
"""

import asyncio
from sqlalchemy import create_engine, text
from database import engine
from models import Base, User
from auth import get_password_hash
from sqlalchemy.orm import sessionmaker
from config import settings

def drop_all_tables():
    """Drop all existing tables"""
    print("🗑️  Dropping all existing tables...")
    
    # Drop all tables
    Base.metadata.drop_all(bind=engine)
    print("✅ All tables dropped successfully!")

def create_tables():
    """Create all tables fresh"""
    print("📋 Creating fresh database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

def create_admin_user():
    """Create initial admin user with new credentials"""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Create admin user
        hashed_password = get_password_hash("veloadmin123")
        admin_user = User(
            email="admin@veloscope.com",
            username="admin",
            hashed_password=hashed_password,
            role="admin"
        )
        
        db.add(admin_user)
        db.commit()
        print("✅ Admin user created successfully!")
        print("   Email: admin@veloscope.com")
        print("   Password: veloadmin123")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """Main reset function"""
    print("🔄 Resetting Presentation Analytics Database...")
    print("=" * 50)
    print("⚠️  WARNING: This will delete ALL existing data!")
    print("=" * 50)
    
    # Drop all tables
    drop_all_tables()
    
    # Create tables fresh
    create_tables()
    
    # Create admin user
    create_admin_user()
    
    print("=" * 50)
    print("🎉 Database reset complete!")
    print("\n📝 Next steps:")
    print("1. Start the application: python -m uvicorn main:app --reload")
    print("2. Access the frontend: http://localhost:3000")
    print("3. Login with admin@veloscope.com / veloadmin123")
    print("4. View API docs: http://localhost:8000/docs")

if __name__ == "__main__":
    main() 