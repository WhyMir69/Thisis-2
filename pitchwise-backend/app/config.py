import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost/pitchwise_db")
    
    # JWT Settings
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours
    
    # CORS
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # File Upload
    UPLOAD_DIR = "uploads"
    MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50MB

settings = Settings()
