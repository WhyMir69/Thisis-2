from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.pitch import PitchType

class PitchBase(BaseModel):
    title: str
    pitch_type: PitchType
    content: Optional[str] = None

class PitchCreate(PitchBase):
    pass

class PitchUpdate(BaseModel):
    title: Optional[str] = None
    pitch_type: Optional[PitchType] = None
    content: Optional[str] = None
    transcript: Optional[str] = None
    clarity_score: Optional[float] = None
    confidence_score: Optional[float] = None
    engagement_score: Optional[float] = None
    overall_score: Optional[float] = None
    feedback_text: Optional[str] = None

class PitchResponse(PitchBase):
    id: int
    user_id: int
    audio_file_path: Optional[str] = None
    video_file_path: Optional[str] = None
    transcript: Optional[str] = None
    clarity_score: Optional[float] = None
    confidence_score: Optional[float] = None
    engagement_score: Optional[float] = None
    overall_score: Optional[float] = None
    feedback_text: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
