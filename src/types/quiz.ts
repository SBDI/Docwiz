import type { QuestionType } from '@/lib/constants'
import type { Database } from '@/lib/database.types'

export type Quiz = Database['public']['Tables']['quizzes']['Row'] & {
  questions: Question[]
}

export type Question = {
  id: string
  quiz_id: string
  type: QuestionType
  question: string
  options: string[] | null
  correct_answer: string
  order_index: number
}

export type QuizCreationData = {
  title: string
  description?: string
  questions: Omit<Question, 'id' | 'quiz_id'>[]
} 