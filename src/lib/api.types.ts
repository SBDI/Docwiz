export interface GenerateQuizResponse {
  id: string
  questions: Array<{
    question: string
    type: 'multiple-choice' | 'true-false'
    options?: string[]
    correctAnswer: string
  }>
}

export interface QuizGenerationError {
  message: string
  code: string
} 