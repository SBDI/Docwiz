from functools import lru_cache
from pydantic_settings import BaseSettings
from .services.ai_service import AIService

class Settings(BaseSettings):
    HUGGINGFACE_API_KEY: str
    MODEL_NAME: str = "mistralai/Mistral-7B-Instruct-v0.1"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

@lru_cache()
def get_ai_service():
    settings = get_settings()
    return AIService(
        api_key=settings.HUGGINGFACE_API_KEY,
        model_name=settings.MODEL_NAME
    ) 