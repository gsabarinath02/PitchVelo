from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
from models import PageVisit, LoginEvent, LogoutEvent, User, FormSubmission
from schemas import PageVisitCreate, PageVisitUpdate, PageVisitResponse, LoginEventResponse, LogoutEventResponse, UserAnalytics, SimplifiedUserAnalytics, UserSessionData
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

@router.post("/logout")
def create_logout_event(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find the most recent login event for this user
    latest_login = db.query(LoginEvent).filter(
        LoginEvent.user_id == current_user.id
    ).order_by(LoginEvent.login_timestamp.desc()).first()
    
    if latest_login:
        # Calculate session duration
        session_duration = (datetime.utcnow() - latest_login.login_timestamp).total_seconds()
        latest_login.session_duration_seconds = session_duration
    
    # Create logout event
    logout_event = LogoutEvent(
        user_id=current_user.id,
        login_event_id=latest_login.id if latest_login else None
    )
    db.add(logout_event)
    db.commit()
    db.refresh(logout_event)
    
    return {"message": "Logout event recorded"}

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
        
        logout_events = db.query(LogoutEvent).filter(
            LogoutEvent.user_id == user.id
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
            logout_events=logout_events,
            page_visits=page_visits,
            form_submissions=form_submissions
        ))
    
    return analytics

@router.get("/simplified-analytics", response_model=List[SimplifiedUserAnalytics])
def get_simplified_user_analytics(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get simplified analytics focusing on login/logout times, session duration, and form submission status"""
    users = db.query(User).all()
    analytics = []
    
    for user in users:
        login_events = db.query(LoginEvent).filter(
            LoginEvent.user_id == user.id
        ).order_by(LoginEvent.login_timestamp.desc()).all()
        
        logout_events = db.query(LogoutEvent).filter(
            LogoutEvent.user_id == user.id
        ).order_by(LogoutEvent.logout_timestamp.desc()).all()
        
        form_submissions = db.query(FormSubmission).filter(
            FormSubmission.user_id == user.id
        ).all()
        
        # Create session data
        sessions = []
        total_time_spent = 0
        
        for login_event in login_events:
            # Find corresponding logout event
            logout_event = next(
                (logout for logout in logout_events if logout.login_event_id == login_event.id),
                None
            )
            
            session_duration = login_event.session_duration_seconds or 0
            total_time_spent += session_duration
            
            sessions.append(UserSessionData(
                login_timestamp=login_event.login_timestamp,
                logout_timestamp=logout_event.logout_timestamp if logout_event else None,
                session_duration_seconds=session_duration,
                has_submitted_form=len(form_submissions) > 0
            ))
        
        analytics.append(SimplifiedUserAnalytics(
            user=user,
            sessions=sessions,
            total_time_spent_seconds=total_time_spent,
            total_logins=len(login_events),
            has_submitted_form=len(form_submissions) > 0
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
    
    logout_events = db.query(LogoutEvent).filter(
        LogoutEvent.user_id == current_user.id
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
        "logout_events": logout_events,
        "page_visits": page_visits,
        "form_submission": form_submission
    } 