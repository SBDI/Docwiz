export interface QuizGenerationResponse {
  questions: Array<{
    question: string
    options: string[]
    correct_answer: string
  }>
}

export interface QuizGenerationError {
  message: string
  code: string
} 