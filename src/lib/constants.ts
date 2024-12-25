// Constants and configuration
export const APP_CONFIG = {
  MAX_QUIZ_QUESTIONS: 50,
  DEFAULT_CREDITS: 10,
  RATE_LIMITS: {
    QUIZ_GENERATION: { max: 10, window: 60 }, // 10 requests per hour
  }
}

export const QUESTION_TYPES = [
  'multiple-choice',
  'true-false',
  'fill-in-blank'
] as const

export type QuestionType = typeof QUESTION_TYPES[number]

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  'multiple-choice': 'Multiple Choice (MCQ)',
  'true-false': 'True/False',
  'fill-in-blank': 'Fill in the Blank'
} as const

export const DIFFICULTY_LEVELS = [
  'Easy',
  'Medium',
  'Hard'
] as const

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number]

export const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Arabic'
] as const

export type Language = typeof LANGUAGES[number]