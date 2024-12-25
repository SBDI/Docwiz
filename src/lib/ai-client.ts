import { ChatCompletionResponse, AIConfig } from '@/types/ai';
import { config } from '@/config';
import type { Question } from '@/types/quiz';
import { QUIZ_GENERATION_PROMPT, replacePromptVariables, QuestionGeneration } from './prompts';
import { 
  QuestionType, 
  QUESTION_TYPES,
  type DifficultyLevel,
  type Language 
} from './constants';

export interface QuizOptions {
  language: Language;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  numberOfQuestions: number;
  numberOfOptions: number;
}

const makeApiRequest = async (messages: Array<{ role: string; content: string }>) => {
  if (!config.ai.apiKey) {
    throw new Error('AI API key is not configured properly');
  }

  const requestBody = {
    model: config.ai.model,
    messages,
    temperature: 0.7,
    max_tokens: 4096,
    stream: false
  };

  const response = await fetch(`${config.ai.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.ai.apiKey}`,
      'Accept': 'application/json'
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('AI API error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });
    throw new Error('AI API request failed');
  }

  return response.json() as Promise<ChatCompletionResponse>;
};

const cleanJsonString = (str: string): string => {
  try {
    // Log the original string for debugging
    console.log('Original response:', str);

    // First try to find JSON between triple backticks if present
    const match = str.match(/```json\s*([\s\S]*?)```/) || 
                 str.match(/```\s*([\s\S]*?)```/);
    if (match) {
      const extracted = match[1].trim();
      console.log('Extracted from backticks:', extracted);
      return extracted;
    }

    // If no backticks, try to find array or object
    let jsonStr = str;
    
    // Remove any markdown or text formatting
    jsonStr = jsonStr.replace(/^[^{\[]*/, ''); // Remove anything before first { or [
    jsonStr = jsonStr.replace(/[^}\]]*$/, ''); // Remove anything after last } or ]
    jsonStr = jsonStr.replace(/\\n/g, ' ').replace(/\s+/g, ' '); // Normalize whitespace
    
    // Try to parse as is
    try {
      JSON.parse(jsonStr);
      console.log('Cleaned JSON:', jsonStr);
      return jsonStr;
    } catch (e) {
      console.log('Failed to parse cleaned JSON, trying to fix common issues');
      
      // Try to fix common JSON issues
      jsonStr = jsonStr
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // Quote unquoted keys
        .replace(/'/g, '"') // Replace single quotes with double quotes
        .trim();
      
      console.log('Fixed JSON:', jsonStr);
      return jsonStr;
    }
  } catch (error) {
    console.error('Error cleaning JSON string:', error);
    console.error('Original string:', str);
    throw error;
  }
};

const validateQuestion = (q: any, index: number, type: QuestionType): QuestionGeneration => {
  if (!q.question || typeof q.question !== 'string') {
    throw new Error(`Question ${index + 1} is missing or invalid`);
  }

  if (!q.correct_answer || typeof q.correct_answer !== 'string') {
    throw new Error(`Question ${index + 1} is missing correct answer`);
  }

  // Only require options for multiple-choice and true-false questions
  if (type !== 'fill-in-blank') {
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new Error(`Question ${index + 1} has invalid options`);
    }
  }

  const validatedQuestion: QuestionGeneration = {
    question: q.question,
    options: type === 'fill-in-blank' ? null : q.options.map(opt => typeof opt === 'string' ? opt : opt.text || opt.value || String(opt)),
    correct_answer: q.correct_answer,
    explanation: q.explanation || `Explanation for question ${index + 1}`
  };

  return validatedQuestion;
};

export const aiClient = {
  testApiKey: async (): Promise<boolean> => {
    try {
      await makeApiRequest([
        { role: 'system', content: 'You are a test assistant.' },
        { role: 'user', content: 'Testing. Just say hi and nothing else.' }
      ]);
      return true;
    } catch (error) {
      console.error('API Key Test Error:', error);
      throw error;
    }
  },

  generateQuiz: async (content: string, options: QuizOptions): Promise<Question[]> => {
    const prompt = replacePromptVariables(QUIZ_GENERATION_PROMPT, {
      content,
      questionType: options.questionType,
      difficulty: options.difficulty,
      language: options.language,
      numberOfQuestions: options.numberOfQuestions,
      numberOfOptions: options.numberOfOptions
    });

    const response = await makeApiRequest([
      { role: 'system', content: 'You are a quiz generation assistant.' },
      { role: 'user', content: prompt }
    ]);

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No content in response');
    }

    try {
      const cleanedJson = cleanJsonString(responseContent);
      const parsed = JSON.parse(cleanedJson);
      
      // Handle both array and object formats
      const questions = Array.isArray(parsed) ? parsed : parsed.questions;
      
      if (!Array.isArray(questions)) {
        throw new Error('Response does not contain valid questions array');
      }

      return questions.map((q, i) => ({
        ...validateQuestion(q, i, options.questionType),
        id: `temp-${i}`,
        quiz_id: '',
        type: options.questionType,
        order_index: i
      }));
    } catch (error) {
      console.error('Failed to parse quiz response:', error);
      throw new Error('Failed to generate quiz questions');
    }
  }
};
