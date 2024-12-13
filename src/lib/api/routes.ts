import { z } from 'zod'

// Core MVP Endpoints
export const API_ROUTES = {
  quiz: {
    generate: '/api/quiz/generate',  // Generate quiz from content
    create: '/api/quiz',            // Save generated quiz
    get: (id: string) => `/api/quiz/${id}`,  // Get quiz details
    attempt: (id: string) => `/api/quiz/${id}/attempt`,  // Submit quiz attempt
  },
  templates: {
    list: '/api/templates',  // List available templates
    use: (id: string) => `/api/templates/${id}/use`,  // Use template to create quiz
  },
  user: {
    credits: '/api/user/credits',  // Check/update user credits
  }
} as const

// MVP Schema Definitions
export const schemas = {
  quiz: {
    generate: {
      request: z.object({
        content: z.string().min(1),
        type: z.enum(['text']), // MVP: Start with text only
        options: z.object({
          questionCount: z.number().min(1).max(10).optional(), // Limit to 10 for MVP
          type: z.enum(['multiple-choice']).optional(), // MVP: Start with multiple-choice only
        }).optional(),
      }),
      response: z.object({
        id: z.string(),
        questions: z.array(z.object({
          id: z.string(),
          type: z.literal('multiple-choice'),
          question: z.string(),
          options: z.array(z.string()),
          correct_answer: z.string(),
        }))
      })
    },

    attempt: {
      request: z.object({
        quiz_id: z.string(),
        answers: z.array(z.object({
          question_id: z.string(),
          answer: z.string(),
        }))
      }),
      response: z.object({
        score: z.number(),
        total: z.number(),
        correct_answers: z.array(z.object({
          question_id: z.string(),
          is_correct: z.boolean(),
          correct_answer: z.string(),
        }))
      })
    }
  },

  templates: {
    list: {
      request: z.object({
        category: z.string().optional(),
        page: z.number().optional(),
      })
    }
  }
}

// Type Exports
export type GenerateQuizRequest = z.infer<typeof schemas.quiz.generate.request>
export type GenerateQuizResponse = z.infer<typeof schemas.quiz.generate.response>
export type CreateQuizRequest = z.infer<typeof schemas.quiz.create.request>
export type QuizAttemptRequest = z.infer<typeof schemas.quiz.attempt.request>
export type QuizAttemptResponse = z.infer<typeof schemas.quiz.attempt.response>