import { supabase } from './supabase/client'
import type { GenerateQuizResponse, QuizGenerationError } from './api.types'

export const apiClient = {
  generateQuiz: async (content: string): Promise<GenerateQuizResponse> => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const response = await fetch('/api/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ content })
    })

    if (!response.ok) {
      const error = await response.json() as QuizGenerationError
      throw new Error(error.message)
    }

    return response.json()
  },

  purchaseCredits: async (quantity: number) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    // Implement Stripe payment logic here
    // ...
  }
} 