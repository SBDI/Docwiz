from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import quiz

app = FastAPI(title="Quizly AI Service")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include AI routes
app.include_router(quiz.router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}