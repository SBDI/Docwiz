import { QuizGenerationResponse } from './api/types'

const OLLAMA_URL = 'http://localhost:11434'

export const ollamaClient = {
  generateQuiz: async (content: string): Promise<QuizGenerationResponse> => {
    const systemPrompt = `You are a quiz generation assistant. Generate a quiz based on the given content.
The response should be a valid JSON object with a 'questions' array containing quiz questions.
Each question should have:
- question: string (the question text)
- options: string[] (array of possible answers)
- correct_answer: string (the correct answer)
- type: 'multiple-choice' | 'true-false'
- order_index: number

Example format:
{
  "questions": [
    {
      "type": "multiple-choice",
      "question": "What is the capital of France?",
      "options": ["Paris", "London", "Berlin", "Madrid"],
      "correct_answer": "Paris",
      "order_index": 0
    }
  ]
}
`

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: `${systemPrompt}\n\nContent to generate quiz from:\n${content}`,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate quiz')
    }

    const result = await response.json()
    
    try {
      // Parse the response text as JSON
      const parsedResponse = JSON.parse(result.response)
      return parsedResponse
    } catch (error) {
      console.error('Failed to parse Ollama response:', error)
      throw new Error('Failed to parse quiz response')
    }
  }
} 