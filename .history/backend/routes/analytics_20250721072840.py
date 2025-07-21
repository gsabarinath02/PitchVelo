from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
from models import PageVisit, LoginEvent, User, FormSubmission
from schemas import PageVisitCreate, PageVisitUpdate, PageVisitResponse, LoginEventResponse, UserAnalytics
from dependencies import get_current_user, get_current_admin_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.post("/page-visit", response_model=PageVisitResponse)
def create_page_visit(
    visit_data: PageVisitCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    page_visit = PageVisit(
        user_id=current_user.id,
        page_name=visit_data.page_name
    )
    db.add(page_visit)
    db.commit()
    db.refresh(page_visit)
    return page_visit

@router.put("/page-visit/{visit_id}", response_model=PageVisitResponse)
def update_page_visit(
    visit_id: int,
    visit_update: PageVisitUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    page_visit = db.query(PageVisit).filter(
        PageVisit.id == visit_id,
        PageVisit.user_id == current_user.id
    ).first()
    
    if not page_visit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page visit not found"
        )
    
    page_visit.exit_time = visit_update.exit_time
    page_visit.duration_seconds = visit_update.duration_seconds
    db.commit()
    db.refresh(page_visit)
    return page_visit

@router.get("/user-analytics", response_model=List[UserAnalytics])
def get_user_analytics(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()
    analytics = []
    
    for user in users:
        login_events = db.query(LoginEvent).filter(
            LoginEvent.user_id == user.id
        ).all()
        
        page_visits = db.query(PageVisit).filter(
            PageVisit.user_id == user.id
        ).all()
        
        form_submissions = db.query(FormSubmission).filter(
            FormSubmission.user_id == user.id
        ).all()
        
        analytics.append(UserAnalytics(
            user=user,
            login_events=login_events,
            page_visits=page_visits,
            form_submissions=form_submissions
        ))
    
    return analytics

@router.get("/my-analytics")
def get_my_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    login_events = db.query(LoginEvent).filter(
        LoginEvent.user_id == current_user.id
    ).all()
    
    page_visits = db.query(PageVisit).filter(
        PageVisit.user_id == current_user.id
    ).all()
    
    form_submission = db.query(FormSubmission).filter(
        FormSubmission.user_id == current_user.id
    ).first()
    
    return {
        "user": current_user,
        "login_events": login_events,
        "page_visits": page_visits,
        "form_submission": form_submission
    } 