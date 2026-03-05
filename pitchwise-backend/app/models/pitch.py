from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..database import Base

class PitchType(str, enum.Enum):
    ELEVATOR = "elevator"
    SALES = "sales"
    INVESTOR = "investor"
    DEMO = "demo"
    PRODUCT = "product"
    STARTUP = "startup"
    PROBLEM_SOLUTION = "problem-solution"
    PITCH_DECK = "pitch-deck"
    PRE_SEED = "pre-seed"
    SAMPLE_PITCH = "sample-pitch"

class Pitch(Base):
    __tablename__ = "pitches"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    pitch_type = Column(Enum(PitchType), nullable=False)
    content = Column(Text, nullable=True)
    file_path = Column(String(500), nullable=True)  # For uploaded files (PDF, DOC, etc.)
    audio_file_path = Column(String(500), nullable=True)
    video_file_path = Column(String(500), nullable=True)
    transcript = Column(Text, nullable=True)
    
    # Feedback scores (will be populated by AI later)
    clarity_score = Column(Float, nullable=True)
    confidence_score = Column(Float, nullable=True)
    engagement_score = Column(Float, nullable=True)
    overall_score = Column(Float, nullable=True)
    feedback_text = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="pitches")
