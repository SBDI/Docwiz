import { ollamaClient } from '../ollama'
import { QuizGenerationResponseSchema } from './types'

export const aiClient = {
  generateQuiz: async (content: string) => {
    try {
      const response = await ollamaClient.generateQuiz(content)
      
      // Validate response
      const validated = QuizGenerationResponseSchema.parse(response)
      return validated
    } catch (error) {
      console.error('AI API Error:', error)
      throw new Error('Failed to generate quiz')
    }
  }
} 