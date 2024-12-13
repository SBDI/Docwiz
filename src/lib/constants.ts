// Constants and configuration
export const APP_CONFIG = {
  MAX_QUIZ_QUESTIONS: 50,
  DEFAULT_CREDITS: 10,
  RATE_LIMITS: {
    QUIZ_GENERATION: { max: 10, window: 60 }, // 10 requests per hour
  }
}

export const QUESTION_TYPES = ['multiple-choice', 'true-false'] as const
export type QuestionType = typeof QUESTION_TYPES[number] 