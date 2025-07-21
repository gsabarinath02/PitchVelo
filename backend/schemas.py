from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str
    role: str = "user"

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Auth schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Form submission schemas
class FormSubmissionBase(BaseModel):
    feedback: str
    rating: int
    suggestions: Optional[str] = None
    selected_options: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_notes: Optional[str] = None

class FormSubmissionCreate(FormSubmissionBase):
    pass

class FormSubmissionResponse(FormSubmissionBase):
    id: int
    user_id: int
    submitted_at: datetime
    
    class Config:
        from_attributes = True

# Analytics schemas
class LoginEventResponse(BaseModel):
    id: int
    user_id: int
    login_timestamp: datetime
    
    class Config:
        from_attributes = True

class PageVisitBase(BaseModel):
    page_name: str

class PageVisitCreate(PageVisitBase):
    pass

class PageVisitUpdate(BaseModel):
    exit_time: datetime
    duration_seconds: float

class PageVisitResponse(PageVisitBase):
    id: int
    user_id: int
    entry_time: datetime
    exit_time: Optional[datetime] = None
    duration_seconds: Optional[float] = None
    
    class Config:
        from_attributes = True

# Admin schemas
class UserAnalytics(BaseModel):
    user: UserResponse
    login_events: List[LoginEventResponse]
    page_visits: List[PageVisitResponse]
    form_submissions: List[FormSubmissionResponse]

class FormSubmissionWithUser(BaseModel):
    id: int
    user_id: int
    feedback: str
    rating: int
    suggestions: Optional[str] = None
    selected_options: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_notes: Optional[str] = None
    submitted_at: datetime
    user: UserResponse
    
    class Config:
        from_attributes = True 