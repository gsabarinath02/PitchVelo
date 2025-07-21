from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta, timezone
from database import get_db
from models import PageVisit, LoginEvent, LogoutEvent, User, FormSubmission
from schemas import PageVisitCreate, PageVisitUpdate, PageVisitResponse, LoginEventResponse, LogoutEventResponse, UserAnalytics, SimplifiedUserAnalytics, UserSessionData
from dependencies import get_current_user, get_current_admin_user
import structlog

logger = structlog.get_logger()

router = APIRouter(prefix="/analytics", tags=["analytics"])

def calculate_session_duration(login_event: LoginEvent, logout_event: LogoutEvent = None) -> float:
    """Calculate session duration for a login event"""
    if logout_event:
        # Calculate from logout timestamp
        duration = (logout_event.logout_timestamp - login_event.login_timestamp).total_seconds()
        return max(0, duration)  # Ensure non-negative duration
    elif login_event.session_duration_seconds is not None:
        # Use stored session duration
        return max(0, login_event.session_duration_seconds)
    else:
        # For active sessions, calculate current duration
        current_time = datetime.now(timezone.utc)
        duration = (current_time - login_event.login_timestamp).total_seconds()
        # Don't count sessions older than 24 hours as active
        if duration > 24 * 3600:
            return 0
        return max(0, duration)

@router.post("/page-visit", response_model=PageVisitResponse)
def create_page_visit(
    visit_data: PageVisitCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info("Creating page visit", 
                user_id=current_user.id, 
                page_name=visit_data.page_name,
                username=current_user.username)
    
    page_visit = PageVisit(
        user_id=current_user.id,
        page_name=visit_data.page_name
    )
    db.add(page_visit)
    db.commit()
    db.refresh(page_visit)
    
    logger.info("Page visit created", 
                visit_id=page_visit.id, 
                user_id=current_user.id,
                page_name=visit_data.page_name)
    
    return page_visit

@router.put("/page-visit/{visit_id}", response_model=PageVisitResponse)
def update_page_visit(
    visit_id: int,
    visit_update: PageVisitUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info("Updating page visit", 
                visit_id=visit_id, 
                user_id=current_user.id,
                duration_seconds=visit_update.duration_seconds)
    
    page_visit = db.query(PageVisit).filter(
        PageVisit.id == visit_id,
        PageVisit.user_id == current_user.id
    ).first()
    
    if not page_visit:
        logger.warning("Page visit not found", 
                      visit_id=visit_id, 
                      user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page visit not found"
        )
    
    page_visit.exit_time = visit_update.exit_time
    page_visit.duration_seconds = visit_update.duration_seconds
    db.commit()
    db.refresh(page_visit)
    
    logger.info("Page visit updated", 
                visit_id=visit_id, 
                user_id=current_user.id,
                duration_seconds=visit_update.duration_seconds)
    
    return page_visit

# Alternative endpoint for sendBeacon (doesn't require response)
@router.post("/page-visit/{visit_id}/exit")
def update_page_visit_exit(
    visit_id: int,
    visit_update: PageVisitUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info("Updating page visit exit", 
                visit_id=visit_id, 
                user_id=current_user.id,
                duration_seconds=visit_update.duration_seconds)
    
    page_visit = db.query(PageVisit).filter(
        PageVisit.id == visit_id,
        PageVisit.user_id == current_user.id
    ).first()
    
    if page_visit:
        page_visit.exit_time = visit_update.exit_time
        page_visit.duration_seconds = visit_update.duration_seconds
        db.commit()
        logger.info("Page visit exit updated", 
                    visit_id=visit_id, 
                    user_id=current_user.id,
                    duration_seconds=visit_update.duration_seconds)
    else:
        logger.warning("Page visit not found for exit", 
                      visit_id=visit_id, 
                      user_id=current_user.id)
    
    return {"message": "Page visit updated"}

@router.post("/logout")
def create_logout_event(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info("Processing logout event", 
                user_id=current_user.id,
                username=current_user.username)
    
    # Find the most recent login event for this user that doesn't have session_duration_seconds set
    latest_login = db.query(LoginEvent).filter(
        LoginEvent.user_id == current_user.id,
        LoginEvent.session_duration_seconds.is_(None)
    ).order_by(LoginEvent.login_timestamp.desc()).first()
    
    if latest_login:
        # Calculate session duration
        current_time = datetime.now(timezone.utc)
        session_duration = (current_time - latest_login.login_timestamp).total_seconds()
        session_duration = max(0, session_duration)  # Ensure non-negative
        
        # Update the login event with session duration
        latest_login.session_duration_seconds = session_duration
        
        # Check if logout event already exists for this login
        existing_logout = db.query(LogoutEvent).filter(
            LogoutEvent.login_event_id == latest_login.id
        ).first()
        
        if not existing_logout:
            # Create logout event
            logout_event = LogoutEvent(
                user_id=current_user.id,
                login_event_id=latest_login.id
            )
            db.add(logout_event)
        
        db.commit()
        
        logger.info("Logout event recorded", 
                    user_id=current_user.id,
                    login_event_id=latest_login.id,
                    session_duration=session_duration)
        
        return {"message": "Logout event recorded", "session_duration": session_duration}
    
    logger.warning("No active session found for logout", 
                  user_id=current_user.id)
    return {"message": "No active session found"}

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
            
            # Calculate session duration
            session_duration = calculate_session_duration(login_event, logout_event)
            
            # Add to total time only if session is completed (has explicit duration or logout recorded)
            if (login_event.session_duration_seconds is not None) or (logout_event is not None):
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