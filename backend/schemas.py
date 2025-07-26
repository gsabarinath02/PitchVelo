from pydantic import BaseModel, EmailStr, model_validator
from typing import Optional, List, Dict, Any
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
    session_duration_seconds: Optional[float] = None
    
    class Config:
        from_attributes = True

class LogoutEventResponse(BaseModel):
    id: int
    user_id: int
    logout_timestamp: datetime
    login_event_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class UserSessionData(BaseModel):
    login_timestamp: datetime
    logout_timestamp: Optional[datetime] = None
    session_duration_seconds: Optional[float] = None
    has_submitted_form: bool

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
    logout_events: List[LogoutEventResponse]
    page_visits: List[PageVisitResponse]
    form_submissions: List[FormSubmissionResponse]

class SimplifiedUserAnalytics(BaseModel):
    user: UserResponse
    sessions: List[UserSessionData]
    total_time_spent_seconds: float
    total_logins: int
    has_submitted_form: bool

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

# Personalized Presentation schemas
class SlideContent(BaseModel):
    id: int
    title: str
    subtitle: str
    content: Dict[str, Any]  # JSON content for the slide

class PersonalizedPresentationBase(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    slides: List[SlideContent]
    is_active: bool = True
    
    @model_validator(mode='before')
    @classmethod
    def convert_slides(cls, values):
        if isinstance(values, dict) and 'slides' in values:
            slides = values['slides']
            if isinstance(slides, list) and len(slides) > 0 and isinstance(slides[0], dict):
                values['slides'] = [SlideContent(**slide) for slide in slides]
        return values

class PersonalizedPresentationCreate(PersonalizedPresentationBase):
    user_id: int

class PersonalizedPresentationUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    slides: Optional[List[SlideContent]] = None
    is_active: Optional[bool] = None

class PersonalizedPresentationResponse(PersonalizedPresentationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class PersonalizedPresentationWithUser(PersonalizedPresentationResponse):
    user: UserResponse 