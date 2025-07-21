from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from routes import auth, users, forms, analytics

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Presentation Analytics API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(forms.router)
app.include_router(analytics.router)

@app.get("/")
def read_root():
    return {"message": "Presentation Analytics API"} 