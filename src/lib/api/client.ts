import { huggingfaceApi } from './huggingface'
import { openRouterApi } from './openrouter'
import { QuizGenerationResponseSchema } from './types'
import { config } from '@/config'

const AI_PROVIDER = config.ai.provider // 'huggingface' | 'openrouter'

export const aiClient = {
  generateQuiz: async (content: string) => {
    try {
      const api = AI_PROVIDER === 'huggingface' ? huggingfaceApi : openRouterApi
      const response = await api.generateQuiz(content)
      
      // Validate response
      const validated = QuizGenerationResponseSchema.parse(response)
      return validated
    } catch (error) {
      console.error('AI API Error:', error)
      throw new Error('Failed to generate quiz')
    }
  }
} 