# Presentation Analytics Platform

A full-stack web application for viewing interactive presentations with analytics tracking and admin dashboard functionality.

## 🚀 Features

- **Interactive Presentation Viewer**: Multi-slide presentation with smooth animations
- **User Authentication**: JWT-based authentication with role-based access control
- **Analytics Tracking**: Track user engagement, page visits, and time spent
- **Admin Dashboard**: User management and analytics visualization
- **Form Submissions**: Collect feedback and contact information
- **Responsive Design**: Modern UI with Tailwind CSS and Framer Motion

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Python web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **Alembic** - Database migrations
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **Axios** - HTTP client

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration

## 📁 Project Structure

```
├── backend/
│   ├── alembic/           # Database migrations
│   ├── routes/            # API routes
│   ├── models.py          # Database models
│   ├── schemas.py         # Pydantic schemas
│   ├── auth.py            # Authentication utilities
│   ├── dependencies.py    # FastAPI dependencies
│   ├── database.py        # Database configuration
│   ├── config.py          # Settings
│   └── main.py           # FastAPI app
├── frontend/
│   ├── app/              # Next.js app directory
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── lib/              # Utilities and API client
│   └── package.json      # Dependencies
├── docker-compose.yml    # Docker orchestration
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)

### 1. Clone the repository
```bash
git clone <repository-url>
cd presentation-analytics
```

### 2. Start the application
```bash
docker-compose up --build
```

### 3. Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Development Setup

### Backend Development

1. **Install Python dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Set up environment variables**:
```bash
# Create .env file in backend/
DATABASE_URL=postgresql://postgres:password@localhost:5432/presentation_app
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

3. **Run database migrations**:
```bash
cd backend
alembic upgrade head
```

4. **Start the backend**:
```bash
uvicorn main:app --reload
```

### Frontend Development

1. **Install Node.js dependencies**:
```bash
cd frontend
npm install
```

2. **Set up environment variables**:
```bash
# Create .env.local file in frontend/
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Start the frontend**:
```bash
npm run dev
```

## 📊 Database Schema

### Users
- `id` (Primary Key)
- `email` (Unique)
- `username` (Unique)
- `hashed_password`
- `role` (admin/user)
- `created_at`

### Login Events
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `login_timestamp`

### Page Visits
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `page_name`
- `entry_time`
- `exit_time`
- `duration_seconds`

### Form Submissions
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `feedback`
- `rating`
- `suggestions`
- `selected_options`
- `contact_name`
- `contact_email`
- `contact_phone`
- `contact_notes`
- `submitted_at`

## 🔐 Authentication

The application uses JWT-based authentication with the following flow:

1. **Login**: User provides email/password → Returns JWT token
2. **Protected Routes**: Include JWT token in Authorization header
3. **Role-based Access**: Admin routes require admin role

### Default Admin User
Create an admin user through the API:
```bash
curl -X POST "http://localhost:8000/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  }'
```

## 📈 Analytics Tracking

The application automatically tracks:

- **Login Events**: Every successful login
- **Page Visits**: Entry/exit times and duration
- **Form Submissions**: User feedback and ratings

### Analytics Data Available
- User login history
- Time spent on each page
- Form submission analytics
- User engagement metrics

## 🎨 Presentation Content

The presentation includes 6 slides covering:

1. **Welcome**: Introduction to EventForce & Veloscope partnership
2. **EventForce Platform**: Technology features and capabilities
3. **Veloscope Creative Solutions**: Marketing and creative services
4. **Pricing**: Special partnership pricing
5. **Value Proposition**: Benefits of the partnership
6. **Call to Action**: Next steps and contact options

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Users (Admin Only)
- `GET /users/` - List all users
- `POST /users/` - Create new user

### Forms
- `POST /forms/submit` - Submit feedback form
- `GET /forms/submissions` - Get all submissions (Admin)
- `GET /forms/my-submission` - Get user's submission

### Analytics
- `POST /analytics/page-visit` - Track page visit
- `PUT /analytics/page-visit/{id}` - Update page visit
- `GET /analytics/user-analytics` - Get all user analytics (Admin)
- `GET /analytics/my-analytics` - Get user's analytics

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build

# Remove volumes (database data)
docker-compose down -v
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/presentation_app
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Note**: This is a demonstration application. For production use, ensure proper security measures, environment variable management, and database backups are implemented. 