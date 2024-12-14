import { config } from '@/config'
import type { Question } from '@/types/quiz'

interface OllamaResponse {
  response: string
  context: number[]
}

interface OllamaQuizOption {
  value: string;
  text: string;
}

interface OllamaQuizQuestion {
  question: string;
  options: OllamaQuizOption[];
  correct_answer: string;
}

interface OllamaQuizResponse {
  questions: OllamaQuizQuestion[];
}

// Update the base URL to use port 3456
const OLLAMA_BASE_URL = 'http://localhost:3456';

export const ollamaClient = {
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
      console.log('Sending request to:', `${OLLAMA_BASE_URL}/api/generate`);
      
      const requestBody = {
        model: 'tinyllama:1.1b-chat',
        prompt,
        stream: false,
        // Add parameters to control response
        temperature: 0.1, // Lower temperature for more focused output
        top_p: 0.9
      };
      
      console.log('Request body:', requestBody);

      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.error('Quiz Generation Error:', {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error(`Failed to generate quiz: ${response.status} ${response.statusText}`);
      }

      const result = await response.json() as OllamaResponse;
      console.log('Raw Ollama Response:', result);

      if (!result.response) {
        throw new Error('Empty response from Ollama');
      }

      // Enhanced response cleaning
      const cleanedResponse = result.response
        .replace(/```json\s*/g, '') // Remove JSON code blocks
        .replace(/```\s*/g, '')     // Remove other code blocks
        .replace(/\n/g, ' ')        // Remove newlines
        .trim()                     // Remove extra whitespace
        .replace(/^[^{]*({.*})[^}]*$/, '$1'); // Extract only the JSON object

      console.log('Cleaned Response:', cleanedResponse);

      try {
        const parsedQuiz = JSON.parse(cleanedResponse) as OllamaQuizResponse;
        console.log('Parsed Quiz:', parsedQuiz);

        // Validate quiz structure
        if (!parsedQuiz.questions || !Array.isArray(parsedQuiz.questions)) {
          throw new Error('Invalid quiz format: questions array is missing');
        }

        if (parsedQuiz.questions.length === 0) {
          throw new Error('Invalid quiz format: no questions generated');
        }

        // Validate each question
        parsedQuiz.questions.forEach((q, i) => {
          if (!q.question || typeof q.question !== 'string') {
            throw new Error(`Invalid question format at index ${i}: missing or invalid question`);
          }
          if (!Array.isArray(q.options) || q.options.length !== 4) {
            throw new Error(`Invalid options format at index ${i}: must have exactly 4 options`);
          }
          // Validate option format
          q.options.forEach((opt, j) => {
            if (!opt.value || !opt.text) {
              throw new Error(`Invalid option format at question ${i}, option ${j}`);
            }
          });
          const optionValues = q.options.map(opt => opt.value);
          if (!q.correct_answer || !optionValues.includes(q.correct_answer)) {
            throw new Error(`Invalid correct_answer at index ${i}: must match one of the option values`);
          }
        });

        // Transform to UI format
        return parsedQuiz.questions.map((q: OllamaQuizQuestion, index: number) => ({
          id: String(index),
          quiz_id: '0',
          type: 'multiple-choice' as const,
          question: q.question,
          options: q.options.map(opt => opt.value), // Use the option values
          correct_answer: q.correct_answer,
          order_index: index
        }));
      } catch (parseError) {
        console.error('Quiz Parse Error:', parseError, 'Raw Response:', result.response);
        throw new Error('Failed to parse quiz response. Please try again.');
      }
    } catch (error) {
      console.error('Quiz Generation Error:', error);
      throw error;
    }
  }
};

// Test connection function
export const testOllamaConnection = async () => {
  try {
    console.log('Testing Ollama connection:', `${OLLAMA_BASE_URL}/api/tags`);
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    
    if (!response.ok) {
      console.error('Ollama Test Response:', {
        status: response.status,
        statusText: response.statusText
      });
      return false;
    }

    const data = await response.json();
    console.log('Available Ollama Models:', data);
    return true;
  } catch (error) {
    console.error('Ollama Connection Error:', error);
    return false;
  }
};

// Test function for TinyLlama
export const testTinyLlama = async () => {
  try {
    console.log('Testing TinyLlama quiz generation...');
    
    const testContent = `
    Cats are domesticated mammals known for their independence and hunting abilities.
    They typically sleep between 12-16 hours a day and are crepuscular, meaning they
    are most active during dawn and dusk. Cats communicate through vocalizations,
    including meowing, purring, and hissing, as well as body language.
    `;

    const quiz = await ollamaClient.generateQuiz(testContent);
    console.log('Test Quiz Generated:', quiz);
    
    // Validate quiz structure
    if (!Array.isArray(quiz) || quiz.length === 0) {
      throw new Error('Invalid quiz format: no questions generated');
    }

    return true;
  } catch (error) {
    console.error('TinyLlama Test Error:', error);
    return false;
  }
}; 