import { API_ROUTES, schemas } from './routes'
import { config } from '@/config'

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export const apiClient = {
  quiz: {
    generate: async (content: string, options = {}) => {
      const response = await fetch(API_ROUTES.quiz.generate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, options })
      })

      if (!response.ok) {
        throw new APIError('Failed to generate quiz', response.status, 'GENERATION_FAILED')
      }

      const data = await response.json()
      return schemas.quiz.generate.response.parse(data)
    },

    create: async (data: CreateQuizRequest) => {
      const response = await fetch(API_ROUTES.quiz.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new APIError('Failed to create quiz', response.status, 'CREATION_FAILED')
      }

      return response.json()
    },

    attempt: async (quizId: string, answers: QuizAttemptRequest['answers']) => {
      const response = await fetch(API_ROUTES.quiz.attempt(quizId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers })
      })

      if (!response.ok) {
        throw new APIError('Failed to submit quiz attempt', response.status, 'SUBMISSION_FAILED')
      }

      const data = await response.json()
      return schemas.quiz.attempt.response.parse(data)
    }
  },

  templates: {
    list: async (params = {}) => {
      const queryParams = new URLSearchParams(params as Record<string, string>)
      const response = await fetch(`${API_ROUTES.templates.list}?${queryParams}`)

      if (!response.ok) {
        throw new APIError('Failed to fetch templates', response.status, 'FETCH_FAILED')
      }

      return response.json()
    },

    use: async (templateId: string) => {
      const response = await fetch(API_ROUTES.templates.use(templateId), {
        method: 'POST'
      })

      if (!response.ok) {
        throw new APIError('Failed to use template', response.status, 'TEMPLATE_USE_FAILED')
      }

      return response.json()
    }
  }
} 