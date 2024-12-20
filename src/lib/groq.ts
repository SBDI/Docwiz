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

interface QuizOption {
  value: string;
  text: string;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correct_answer: string;
}

interface QuizResponse {
  questions: QuizQuestion[];
}

export const aiClient = {
  testApiKey: async (): Promise<boolean> => {
    try {
      console.log('Testing X.AI API key...');
      
      // Debug environment variables
      console.log('Environment Variables Available:', {
        VITE_XAI_API_KEY: !!import.meta.env.VITE_XAI_API_KEY,
        VITE_XAI_API_KEY_LENGTH: import.meta.env.VITE_XAI_API_KEY?.length,
      });
      
      if (!config.ai.apiKey) {
        throw new Error('X.AI API key is not configured');
      }

      // Debug API key format (only show length for security)
      console.log('API Key Length:', config.ai.apiKey.length);

      const response = await fetch(`${config.ai.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.ai.apiKey.trim()}`,
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

      const data = await response.json();
      console.log('API Test Response:', data);

      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }

      return true;
    } catch (error) {
      console.error('API Key Test Error:', error);
      throw error;
    }
  },

  generateQuiz: async (content: string): Promise<Question[]> => {
    const prompt = `You are a JSON API that creates multiple choice quizzes. 
Generate a quiz with 5 questions based on this content: "${content}"

Requirements:
- Return ONLY a valid JSON object
- Do not include any explanatory text
- Each question must have exactly 4 options
- Each option must have a value (like "A) Option one") and a text
- The correct_answer must exactly match one of the option values

Example of the required JSON format:
{
  "questions": [
    {
      "question": "What is the main topic discussed?",
      "options": [
        { "value": "A) Option one", "text": "Option one" },
        { "value": "B) Option two", "text": "Option two" },
        { "value": "C) Option three", "text": "Option three" },
        { "value": "D) Option four", "text": "Option four" }
      ],
      "correct_answer": "A) Option one"
    }
  ]
}`;

    try {
      console.log('Generating quiz with X.AI...');
      
      if (!config.ai.apiKey) {
        throw new Error('X.AI API key is not configured');
      }

      const requestBody = {
        model: config.ai.model,
        messages: [
          {
            role: "system",
            content: "You are a quiz generation API that only responds with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        top_p: 0.9,
        max_tokens: 1500
      };
      
      console.log('Request body:', {
        ...requestBody,
        model: config.ai.model,
      });

      const response = await fetch(`${config.ai.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.ai.apiKey.trim()}`,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('X.AI API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        // Parse the error response if it's JSON
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error?.message || `Failed to generate quiz: ${response.status} ${response.statusText}`);
        } catch (e) {
          throw new Error(`Failed to generate quiz: ${response.status} ${response.statusText}`);
        }
      }

      const result = await response.json() as ChatCompletionResponse;
      console.log('Raw X.AI Response:', result);

      if (!result.choices?.[0]?.message?.content) {
        throw new Error('Empty response from X.AI');
      }

      // Enhanced response cleaning
      const cleanedResponse = result.choices[0].message.content
        .replace(/```json\s*/g, '') // Remove JSON code blocks
        .replace(/```\s*/g, '')     // Remove other code blocks
        .replace(/\n/g, ' ')        // Remove newlines
        .trim()                     // Remove extra whitespace
        .replace(/^[^{]*({.*})[^}]*$/, '$1'); // Extract only the JSON object

      console.log('Cleaned Response:', cleanedResponse);

      try {
        const parsedQuiz = JSON.parse(cleanedResponse) as QuizResponse;
        console.log('Parsed Quiz:', parsedQuiz);

        // Validate quiz structure
        if (!parsedQuiz.questions || !Array.isArray(parsedQuiz.questions)) {
          throw new Error('Invalid quiz format: questions array is missing');
        }

        if (parsedQuiz.questions.length === 0) {
          throw new Error('Invalid quiz format: no questions generated');
        }

        // Transform to UI format
        return parsedQuiz.questions.map((q: QuizQuestion, index: number) => ({
          id: String(index),
          quiz_id: '0',
          type: 'multiple-choice' as const,
          question: q.question,
          options: q.options.map(opt => opt.value),
          correct_answer: q.correct_answer,
          order_index: index
        }));
      } catch (parseError) {
        console.error('Quiz Parse Error:', parseError, 'Raw Response:', result.choices[0].message.content);
        throw new Error('Failed to parse quiz response. Please try again.');
      }
    } catch (error) {
      console.error('Quiz Generation Error:', error);
      throw error;
    }
  }
};
