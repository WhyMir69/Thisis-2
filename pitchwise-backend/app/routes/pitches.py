from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from datetime import datetime
from ..database import get_db
from ..models.user import User
from ..models.pitch import Pitch, PitchType
from ..schemas.pitch import PitchCreate, PitchUpdate, PitchResponse
from ..utils.dependencies import get_current_user
from ..config import settings

router = APIRouter(prefix="/pitches", tags=["Pitches"])

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=PitchResponse, status_code=status.HTTP_201_CREATED)
def create_pitch(
    pitch: PitchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new pitch."""
    db_pitch = Pitch(
        user_id=current_user.id,
        title=pitch.title,
        pitch_type=pitch.pitch_type,
        content=pitch.content
    )
    
    db.add(db_pitch)
    db.commit()
    db.refresh(db_pitch)
    
    return db_pitch

@router.get("/", response_model=List[PitchResponse])
def get_user_pitches(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all pitches for the current user."""
    pitches = db.query(Pitch).filter(
        Pitch.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return pitches

@router.get("/{pitch_id}", response_model=PitchResponse)
def get_pitch(
    pitch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific pitch by ID."""
    pitch = db.query(Pitch).filter(
        Pitch.id == pitch_id,
        Pitch.user_id == current_user.id
    ).first()
    
    if not pitch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pitch not found"
        )
    
    return pitch

@router.put("/{pitch_id}", response_model=PitchResponse)
def update_pitch(
    pitch_id: int,
    pitch_update: PitchUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a pitch."""
    pitch = db.query(Pitch).filter(
        Pitch.id == pitch_id,
        Pitch.user_id == current_user.id
    ).first()
    
    if not pitch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pitch not found"
        )
    
    # Update fields
    update_data = pitch_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(pitch, field, value)
    
    db.commit()
    db.refresh(pitch)
    
    return pitch

@router.post("/upload-pitch-file", response_model=PitchResponse, status_code=status.HTTP_201_CREATED)
async def upload_pitch_file(
    file: UploadFile = File(...),
    pitch_type: str = Form(...),
    title: str = Form(default="User Pitch"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload a pitch file (PDF, DOC, TXT, etc.) for AI analysis."""
    # Validate file type
    allowed_extensions = ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx']
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    # Validate file size (from settings)
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    if file_size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE / (1024*1024)}MB"
        )
    
    # Create pitch record first
    db_pitch = Pitch(
        user_id=current_user.id,
        title=title,
        pitch_type=pitch_type,
        content=f"File uploaded: {file.filename}"
    )
    
    db.add(db_pitch)
    db.commit()
    db.refresh(db_pitch)
    
    # Save file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"pitch_{current_user.id}_{db_pitch.id}_{timestamp}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Update pitch with file path
        db_pitch.file_path = file_path
        db.commit()
        db.refresh(db_pitch)
        
        return db_pitch
    except Exception as e:
        # If file save fails, delete the pitch record
        db.delete(db_pitch)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )

@router.delete("/{pitch_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pitch(
    pitch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a pitch."""
    pitch = db.query(Pitch).filter(
        Pitch.id == pitch_id,
        Pitch.user_id == current_user.id
    ).first()
    
    if not pitch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pitch not found"
        )
    
    # Delete associated files if they exist
    if pitch.audio_file_path and os.path.exists(pitch.audio_file_path):
        os.remove(pitch.audio_file_path)
    if pitch.video_file_path and os.path.exists(pitch.video_file_path):
        os.remove(pitch.video_file_path)
    
    db.delete(pitch)
    db.commit()
    
    return None

@router.post("/{pitch_id}/upload-audio", response_model=PitchResponse)
async def upload_audio(
    pitch_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload audio file for a pitch."""
    pitch = db.query(Pitch).filter(
        Pitch.id == pitch_id,
        Pitch.user_id == current_user.id
    ).first()
    
    if not pitch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pitch not found"
        )
    
    # Save file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"audio_{current_user.id}_{pitch_id}_{timestamp}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update pitch with file path
    pitch.audio_file_path = file_path
    db.commit()
    db.refresh(pitch)
    
    return pitch

@router.post("/{pitch_id}/upload-video", response_model=PitchResponse)
async def upload_video(
    pitch_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload video file for a pitch."""
    pitch = db.query(Pitch).filter(
        Pitch.id == pitch_id,
        Pitch.user_id == current_user.id
    ).first()
    
    if not pitch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pitch not found"
        )
    
    # Save file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"video_{current_user.id}_{pitch_id}_{timestamp}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update pitch with file path
    pitch.video_file_path = file_path
    db.commit()
    db.refresh(pitch)
    
    return pitch

@router.get("/analytics/dashboard")
def get_dashboard_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get analytics data for the dashboard."""
    # Get all user pitches
    pitches = db.query(Pitch).filter(Pitch.user_id == current_user.id).all()
    
    # Calculate statistics
    total_pitches = len(pitches)
    
    # Average scores
    scored_pitches = [p for p in pitches if p.overall_score is not None]
    avg_overall_score = sum(p.overall_score for p in scored_pitches) / len(scored_pitches) if scored_pitches else 0
    avg_clarity = sum(p.clarity_score for p in scored_pitches if p.clarity_score) / len(scored_pitches) if scored_pitches else 0
    avg_confidence = sum(p.confidence_score for p in scored_pitches if p.confidence_score) / len(scored_pitches) if scored_pitches else 0
    avg_engagement = sum(p.engagement_score for p in scored_pitches if p.engagement_score) / len(scored_pitches) if scored_pitches else 0
    
    # Pitches by type
    pitches_by_type = {}
    for pitch_type in PitchType:
        count = len([p for p in pitches if p.pitch_type == pitch_type])
        pitches_by_type[pitch_type.value] = count
    
    # Recent pitches (last 5)
    recent_pitches = db.query(Pitch).filter(
        Pitch.user_id == current_user.id
    ).order_by(Pitch.created_at.desc()).limit(5).all()
    
    return {
        "total_pitches": total_pitches,
        "average_scores": {
            "overall": round(avg_overall_score, 2),
            "clarity": round(avg_clarity, 2),
            "confidence": round(avg_confidence, 2),
            "engagement": round(avg_engagement, 2)
        },
        "pitches_by_type": pitches_by_type,
        "recent_pitches": [PitchResponse.from_orm(p) for p in recent_pitches]
    }
