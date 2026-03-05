# PitchWise Backend API

Backend API for PitchWise - An AI-Powered Pitch Evaluation Platform built with FastAPI, MySQL, and JWT authentication.

## 🚀 Features

- ✅ User registration and authentication (JWT)
- ✅ Pitch management (CRUD operations)
- ✅ Audio/Video file uploads
- ✅ Pitch analytics and dashboard data
- ✅ RESTful API design
- ✅ MySQL database with SQLAlchemy ORM
- ✅ CORS enabled for frontend integration
- 🔄 AI-powered feedback (ready for integration)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- MySQL Server 8.0 or higher
- pip (Python package manager)

## 🛠️ Installation

### 1. Clone the repository (if not already done)

```bash
cd "c:\Users\Ymir\Desktop\Thesis 2\pitchwise-backend"
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

**Windows (Git Bash):**
```bash
source venv/Scripts/activate
```

**Windows (Command Prompt):**
```bash
venv\Scripts\activate
```

**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Set up MySQL database

1. Open MySQL and create a database:

```sql
CREATE DATABASE pitchwise_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Create a MySQL user (optional but recommended):

```sql
CREATE USER 'pitchwise_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON pitchwise_db.* TO 'pitchwise_user'@'localhost';
FLUSH PRIVILEGES;
```

### 6. Configure environment variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` file and update with your actual values:

```env
DATABASE_URL=mysql+pymysql://root:your_mysql_password@localhost/pitchwise_db
SECRET_KEY=generate-a-secure-random-key-here
FRONTEND_URL=http://localhost:3000
```

**To generate a secure SECRET_KEY:**

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 7. Create uploads directory

```bash
mkdir uploads
```

## 🚀 Running the Application

### Start the development server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive API Docs (Swagger)**: http://localhost:8000/docs
- **Alternative API Docs (ReDoc)**: http://localhost:8000/redoc

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user info | Yes |

### Pitches

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/pitches/` | Create new pitch | Yes |
| GET | `/pitches/` | Get all user pitches | Yes |
| GET | `/pitches/{id}` | Get specific pitch | Yes |
| PUT | `/pitches/{id}` | Update pitch | Yes |
| DELETE | `/pitches/{id}` | Delete pitch | Yes |
| POST | `/pitches/{id}/upload-audio` | Upload audio file | Yes |
| POST | `/pitches/{id}/upload-video` | Upload video file | Yes |
| GET | `/pitches/analytics/dashboard` | Get dashboard analytics | Yes |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Welcome message | No |
| GET | `/health` | Health check | No |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Register a user at `/auth/register`
2. Login at `/auth/login` to receive an access token
3. Include the token in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

## 📁 Project Structure

```
pitchwise-backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── models/              # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── pitch.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── pitch.py
│   ├── routes/              # API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── pitches.py
│   └── utils/               # Utility functions
│       ├── __init__.py
│       ├── auth.py          # JWT and password hashing
│       └── dependencies.py  # FastAPI dependencies
├── uploads/                 # Uploaded files directory
├── .env                     # Environment variables (create this)
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore file
├── requirements.txt         # Python dependencies
└── README.md                # This file
```

## 🧪 Testing the API

### Using the interactive docs:

1. Go to http://localhost:8000/docs
2. Register a new user
3. Login to get an access token
4. Click "Authorize" button and enter: `Bearer <your_token>`
5. Test the endpoints!

### Using curl:

```bash
# Register
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create pitch (replace TOKEN with actual token)
curl -X POST "http://localhost:8000/pitches/" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Pitch","pitch_type":"elevator","content":"This is my pitch content"}'
```

## 🔮 Future AI Integration

The database models include fields for AI-powered feedback:
- `clarity_score`
- `confidence_score`
- `engagement_score`
- `overall_score`
- `feedback_text`
- `transcript`

You can integrate AI services later to analyze pitch audio/video and populate these fields.

## 🐛 Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Make sure MySQL is running
2. Verify your DATABASE_URL in `.env`
3. Check if the database exists
4. Verify MySQL user permissions

### Module Import Errors

If you get import errors, make sure:
1. Virtual environment is activated
2. All dependencies are installed: `pip install -r requirements.txt`
3. You're in the correct directory

### Port Already in Use

If port 8000 is already in use:

```bash
uvicorn app.main:app --reload --port 8001
```

## 📝 Notes

- The database tables will be created automatically when you first run the application
- File uploads are stored in the `uploads/` directory
- JWT tokens expire after 24 hours (configurable in `config.py`)
- CORS is enabled for `http://localhost:3000` by default

## 🤝 Connecting to Frontend

Your frontend is configured to run on http://localhost:3000. Make sure to:

1. Update your frontend API calls to point to http://localhost:8000
2. Include the JWT token in the Authorization header for protected routes
3. Handle CORS properly (already configured in backend)

## 📄 License

This project is for thesis/educational purposes.

---

**Need Help?** Check the interactive API docs at http://localhost:8000/docs for detailed endpoint information and try-it-out functionality.
