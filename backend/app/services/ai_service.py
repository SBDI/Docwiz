from huggingface_hub import InferenceClient
from fastapi import HTTPException
import json
from typing import Dict, List

class AIService:
    def __init__(self, api_key: str, model_name: str):
        self.client = InferenceClient(token=api_key)
        self.model = model_name

    async def generate_quiz(self, content: str, num_questions: int = 5) -> Dict:
        try:
            prompt = f"""Generate a multiple choice quiz with {num_questions} questions based on this content:
            {content}
            
            Return ONLY a JSON object with this exact structure:
            {{
                "questions": [
                    {{
                        "question": "question text",
                        "options": ["option1", "option2", "option3", "option4"],
                        "correct_answer": "correct option"
                    }}
                ]
            }}
            """
            
            response = await self.client.text_generation(
                prompt,
                model=self.model,
                max_new_tokens=1024,
                temperature=0.7
            )
            
            return json.loads(response)
            
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to generate quiz: {str(e)}"
            )