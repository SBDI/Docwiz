import { z } from 'zod'
import type { QuestionType } from '@/lib/constants'

export const QuestionSchema = z.object({
  type: z.enum(['multiple-choice', 'true-false']),
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  correct_answer: z.string(),
  order_index: z.number()
})

export const QuizGenerationResponseSchema = z.object({
  questions: z.array(QuestionSchema)
})

export type QuizGenerationResponse = z.infer<typeof QuizGenerationResponseSchema>

export interface AIError {
  message: string
  code: string
} 