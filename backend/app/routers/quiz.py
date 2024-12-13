from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ..services.ai_service import AIService
from ..config import get_ai_service

router = APIRouter(prefix="/quiz", tags=["quiz"])

class QuizRequest(BaseModel):
    content: str
    num_questions: Optional[int] = 5

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str

class QuizResponse(BaseModel):
    questions: List[QuizQuestion]

@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(
    request: QuizRequest,
    ai_service: AIService = Depends(get_ai_service)
):
    """Generate a quiz from the provided content"""
    return await ai_service.generate_quiz(
        request.content, 
        request.num_questions
    )