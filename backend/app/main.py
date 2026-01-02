import sys
import os

# Add the parent directory of 'app' to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import cows
from app import models

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cow Manager Backend")

# Allow CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cows.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Cow Manager API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
