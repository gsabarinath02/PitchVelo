from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user")  # "admin" or "user"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    login_events = relationship("LoginEvent", back_populates="user")
    logout_events = relationship("LogoutEvent", back_populates="user")
    page_visits = relationship("PageVisit", back_populates="user")
    form_submissions = relationship("FormSubmission", back_populates="user")
    personalized_presentations = relationship("PersonalizedPresentation", back_populates="user")

class LoginEvent(Base):
    __tablename__ = "login_events"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    login_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    session_duration_seconds = Column(Float, nullable=True)  # Duration until logout
    
    # Relationships
    user = relationship("User", back_populates="login_events")

class LogoutEvent(Base):
    __tablename__ = "logout_events"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    logout_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    login_event_id = Column(Integer, ForeignKey("login_events.id"), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="logout_events")

class PageVisit(Base):
    __tablename__ = "page_visits"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    page_name = Column(String)
    entry_time = Column(DateTime(timezone=True), server_default=func.now())
    exit_time = Column(DateTime(timezone=True), nullable=True)
    duration_seconds = Column(Float, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="page_visits")

class FormSubmission(Base):
    __tablename__ = "form_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    feedback = Column(Text)
    rating = Column(Integer)  # 1-5 rating
    suggestions = Column(Text, nullable=True)
    selected_options = Column(Text, nullable=True)  # JSON string of selected options
    contact_name = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    contact_notes = Column(Text, nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="form_submissions") 

class PersonalizedPresentation(Base):
    __tablename__ = "personalized_presentations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=True)  # Custom title for the presentation
    subtitle = Column(String, nullable=True)  # Custom subtitle
    slides = Column(JSON)  # JSON array of customized slides
    is_active = Column(Boolean, default=True)  # Whether this personalized presentation is active
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="personalized_presentations") 