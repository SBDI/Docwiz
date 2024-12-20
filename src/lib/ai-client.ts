import { config } from '@/config'
import type { Question } from '@/types/quiz'

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const aiClient = {
  testApiKey: async (): Promise<boolean> => {
    try {
      console.log('Testing X.AI API key...');
      
      if (!config.ai.apiKey) {
        throw new Error('X.AI API key is not configured');
      }

      const response = await fetch(`${config.ai.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.ai.apiKey}`,
        },
        body: JSON.stringify({
          model: config.ai.model,
          messages: [
            {
              role: "system",
              content: "You are a test assistant."
            },
            {
              role: "user",
              content: "Testing. Just say hi and nothing else."
            }
          ],
          temperature: 0
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      const data = await response.json();
      console.log('API Test Response:', data);
      return true;
    } catch (error) {
      console.error('API Key Test Error:', error);
      throw error;
    }
  },

  generateQuiz: async (content: string): Promise<Question[]> => {
    try {
      const response = await fetch(`${config.ai.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.ai.apiKey}`,
        },
        body: JSON.stringify({
          model: config.ai.model,
          messages: [
            {
              role: "system",
              content: `You are a quiz generation API. You will receive content and generate multiple choice questions from it.
Always respond with a JSON array of questions in this format:
[
  {
    "question": "Question text here?",
    "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
    "correct_answer": "A) First option"
  }
]`
            },
            {
              role: "user",
              content: `Generate 5 multiple choice questions from this content: "${content}"`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate quiz');
      }

      const data: ChatCompletionResponse = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      // Transform the response into Question format
      return result.map((q: any, index: number) => ({
        id: String(index),
        quiz_id: '0',
        type: 'multiple-choice',
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        order_index: index
      }));
    } catch (error) {
      console.error('Quiz Generation Error:', error);
      throw error;
    }
  }
};
