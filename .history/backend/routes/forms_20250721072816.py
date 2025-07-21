from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import FormSubmission, User
from schemas import FormSubmissionCreate, FormSubmissionResponse
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

@router.get("/submissions", response_model=List[FormSubmissionResponse])
def get_all_submissions(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    submissions = db.query(FormSubmission).all()
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