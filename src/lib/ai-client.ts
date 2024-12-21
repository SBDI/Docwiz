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

export interface QuizOptions {
  language: string;
  questionType: string;
  difficulty: string;
}

const cleanJsonString = (str: string): string => {
  // Remove any non-JSON content before and after the array
  const match = str.match(/\[[\s\S]*\]/);
  if (!match) {
    throw new Error('Invalid response format: Expected JSON array');
  }
  
  // Clean up any potential Unicode or special characters that might break JSON parsing
  return match[0]
    .replace(/[\u0000-\u001F]+/g, ' ') // Remove control characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

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

  generateQuiz: async (content: string, options: QuizOptions): Promise<Question[]> => {
    try {
      const { language, questionType, difficulty } = options;
      
      // Enhanced language detection patterns
      const languagePatterns = {
        arabic: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
        chinese: /[\u4E00-\u9FFF]/,
        japanese: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/,
        korean: /[\uAC00-\uD7AF\u1100-\u11FF]/,
        thai: /[\u0E00-\u0E7F]/,
        devanagari: /[\u0900-\u097F]/, // Hindi and other Indian languages
      };

      // Detect content language
      let detectedLanguage = 'English'; // Default to English
      for (const [lang, pattern] of Object.entries(languagePatterns)) {
        if (pattern.test(content)) {
          detectedLanguage = lang.charAt(0).toUpperCase() + lang.slice(1);
          break;
        }
      }

      const outputLanguage = language === 'Auto Detect' ? detectedLanguage : language;
      
      const systemPrompt = `You are a quiz generation API. You will receive content and generate multiple choice questions from it.
Follow these specific requirements:
- Language: ${outputLanguage}
- Question Type: ${questionType === 'Mix (All Types)' ? 'Mix different types of questions (factual, conceptual, analytical)' : `Focus on ${questionType} questions`}
- Difficulty: ${difficulty === 'Auto' ? 'Adapt difficulty based on content complexity' : `Generate ${difficulty.toLowerCase()} difficulty questions`}

${outputLanguage !== 'English' ? `
Special ${outputLanguage} Instructions:
- Ensure all questions and answers use proper ${outputLanguage} grammar and writing conventions
- Use appropriate numerals and formatting for ${outputLanguage}
- Maintain correct text direction and formatting
- Use culturally appropriate examples and references
- IMPORTANT: Ensure the response is a valid JSON array` : ''}

Always respond with a JSON array of questions in this exact format, with no additional text:
[
  {
    "question": "Question text here?",
    "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
    "correct_answer": "A) First option"
  }
]`;

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
              content: systemPrompt
            },
            {
              role: "user",
              content: `Generate 5 multiple choice questions from this content. Return ONLY the JSON array with no additional text: "${content}"`
            }
          ],
          temperature: difficulty === 'Auto' ? 0.7 : 0.5,
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
      
      // Log the raw response for debugging
      console.log('Raw AI Response:', data.choices[0].message.content);
      
      // Clean and parse the response
      const cleanedJson = cleanJsonString(data.choices[0].message.content);
      console.log('Cleaned JSON:', cleanedJson);
      
      let result;
      try {
        result = JSON.parse(cleanedJson);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Failed to parse quiz response. The AI response was not in valid JSON format.');
      }

      if (!Array.isArray(result)) {
        throw new Error('Invalid response format: Expected an array of questions');
      }

      // Transform and validate the response
      return result.map((q: any, index: number) => {
        if (!q.question || !Array.isArray(q.options) || !q.correct_answer) {
          throw new Error(`Invalid question format at index ${index}`);
        }
        
        return {
          id: String(index),
          quiz_id: '0',
          type: 'multiple-choice',
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
          order_index: index
        };
      });
    } catch (error) {
      console.error('Quiz Generation Error:', error);
      throw error;
    }
  }
};
