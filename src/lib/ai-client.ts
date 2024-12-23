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
  return str
    .replace(/^[^{]*/, '')  // Remove any text before the first {
    .replace(/[^}]*$/, '')  // Remove any text after the last }
    .trim();
};

const validateQuestion = (q: any, index: number, type: QuestionType): QuestionGeneration => {
  if (!q.question || typeof q.question !== 'string') {
    throw new Error(`Question ${index + 1} is missing or invalid`);
  }

  if (!Array.isArray(q.options) || q.options.length < 2) {
    throw new Error(`Question ${index + 1} has invalid options`);
  }

  if (!q.correct_answer || typeof q.correct_answer !== 'string') {
    throw new Error(`Question ${index + 1} is missing correct answer`);
  }

  const validatedQuestion: QuestionGeneration = {
    question: q.question,
    options: q.options.map(opt => ({
      value: opt.value || opt,
      text: opt.text || opt
    })),
    correct_answer: q.correct_answer,
    explanation: q.explanation || `Explanation for question ${index + 1}` // Add default explanation
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
      
      if (!Array.isArray(parsed.questions)) {
        throw new Error('Response does not contain questions array');
      }

      return parsed.questions.map((q, i) => validateQuestion(q, i, options.questionType));
    } catch (error) {
      console.error('Failed to parse quiz response:', error);
      throw new Error('Failed to generate quiz questions');
    }
  }
};
