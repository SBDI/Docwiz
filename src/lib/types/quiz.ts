// Add these types to match backend
export interface QuizQuestion {
  question: string
  options: string[]
  correct_answer: string
}

export interface QuizResponse {
  questions: QuizQuestion[]
} 