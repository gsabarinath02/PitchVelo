from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import FormSubmission, User, PersonalizedPresentation
from schemas import FormSubmissionCreate, FormSubmissionResponse, FormSubmissionWithUser, PersonalizedPresentationCreate, PersonalizedPresentationResponse, PersonalizedPresentationUpdate, PersonalizedPresentationWithUser
from dependencies import get_current_user, get_current_admin_user

router = APIRouter(prefix="/forms", tags=["forms"])

@router.post("/submit", response_model=FormSubmissionResponse)
def submit_form(
    form_data: FormSubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user already has a submission
    existing_submission = db.query(FormSubmission).filter(
        FormSubmission.user_id == current_user.id
    ).first()
    
    if existing_submission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted a form"
        )
    
    # Create new submission
    submission = FormSubmission(
        user_id=current_user.id,
        **form_data.dict()
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    return submission

@router.get("/submissions", response_model=List[FormSubmissionWithUser])
def get_all_submissions(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    submissions = db.query(FormSubmission).join(User).all()
    return submissions

@router.get("/my-submission", response_model=FormSubmissionResponse)
def get_my_submission(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submission = db.query(FormSubmission).filter(
        FormSubmission.user_id == current_user.id
    ).first()
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No submission found"
        )
    
    return submission

# Personalized Presentation endpoints
@router.post("/personalized-presentations", response_model=PersonalizedPresentationResponse)
def create_personalized_presentation(
    presentation_data: PersonalizedPresentationCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    # Check if user exists
    target_user = db.query(User).filter(User.id == presentation_data.user_id).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if presentation already exists for this user
    existing_presentation = db.query(PersonalizedPresentation).filter(
        PersonalizedPresentation.user_id == presentation_data.user_id,
        PersonalizedPresentation.is_active == True
    ).first()
    
    if existing_presentation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has an active personalized presentation"
        )
    
    # Create new personalized presentation
    # Convert SlideContent objects to dictionaries for JSON storage
    slides_dict = [slide.model_dump() for slide in presentation_data.slides]
    presentation = PersonalizedPresentation(
        user_id=presentation_data.user_id,
        title=presentation_data.title,
        subtitle=presentation_data.subtitle,
        slides=slides_dict,
        is_active=presentation_data.is_active
    )
    db.add(presentation)
    db.commit()
    db.refresh(presentation)
    
    return presentation

@router.get("/personalized-presentations", response_model=List[PersonalizedPresentationWithUser])
def get_all_personalized_presentations(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    presentations = db.query(PersonalizedPresentation).join(User).all()
    return presentations

@router.get("/personalized-presentations/{user_id}", response_model=PersonalizedPresentationResponse)
def get_user_personalized_presentation(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is requesting their own presentation or is admin
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this presentation"
        )
    
    presentation = db.query(PersonalizedPresentation).filter(
        PersonalizedPresentation.user_id == user_id,
        PersonalizedPresentation.is_active == True
    ).first()
    
    if not presentation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No personalized presentation found for this user"
        )
    
    return presentation

@router.put("/personalized-presentations/{presentation_id}", response_model=PersonalizedPresentationResponse)
def update_personalized_presentation(
    presentation_id: int,
    presentation_data: PersonalizedPresentationUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    presentation = db.query(PersonalizedPresentation).filter(
        PersonalizedPresentation.id == presentation_id
    ).first()
    
    if not presentation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Presentation not found"
        )
    
    # Update fields if provided
    if presentation_data.title is not None:
        presentation.title = presentation_data.title
    if presentation_data.subtitle is not None:
        presentation.subtitle = presentation_data.subtitle
    if presentation_data.slides is not None:
        # Convert SlideContent objects to dictionaries for JSON storage
        slides_dict = [slide.model_dump() for slide in presentation_data.slides]
        presentation.slides = slides_dict
    if presentation_data.is_active is not None:
        presentation.is_active = presentation_data.is_active
    
    db.commit()
    db.refresh(presentation)
    
    return presentation

@router.delete("/personalized-presentations/{presentation_id}")
def delete_personalized_presentation(
    presentation_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    presentation = db.query(PersonalizedPresentation).filter(
        PersonalizedPresentation.id == presentation_id
    ).first()
    
    if not presentation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Presentation not found"
        )
    
    db.delete(presentation)
    db.commit()
    
    return {"message": "Presentation deleted successfully"} 