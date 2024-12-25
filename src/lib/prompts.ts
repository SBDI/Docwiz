export const QUIZ_GENERATION_PROMPT = `
Given the content below, generate {numberOfQuestions} questions of type {questionType}.
Each question should test understanding of key concepts and include a clear explanation.

Question Type: {questionType}
Number of Questions: {numberOfQuestions}
Number of Options: {numberOfOptions}
Difficulty Level: {difficulty}
Language: {language}

Instructions for questions:
1. Test understanding, not just memorization
2. Match the specified question type format:
   - Multiple Choice (MCQ): {numberOfOptions} options with one correct answer
   - True/False: Two options (True/False)
   - Fill in the Blank: One clear blank to fill with a specific word or phrase (no options needed)
3. Be clear and unambiguous
4. Match the specified difficulty level

Instructions for explanations:
1. Start with WHY the correct answer is right
2. Point out common misconceptions if relevant
3. Keep explanations concise but informative (2-3 sentences)
4. Use examples or analogies when helpful

Content: {content}

Return as a JSON array of questions, where each question has:
{
  "question": "The question text",
  "options": ["A) First option", "B) Second option", ...], // For MCQ and True/False only, omit for Fill in the Blank
  "correct_answer": "The correct answer",
  "explanation": "Clear explanation of why the answer is correct"
}

For Fill in the Blank questions:
1. Use "_____" to indicate the blank in the question
2. The correct_answer should be the exact word or phrase that fits in the blank
3. Do not include options array
4. Example: { "question": "The capital of France is _____.", "correct_answer": "Paris" }`;

export interface GenerateQuizOptions {
  content: string;
  questionType: string;
  numberOfQuestions: number;
  numberOfOptions: number;
  difficulty: string;
  language: string;
}

export interface QuestionGeneration {
  question: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string;
}

export function replacePromptVariables(
  prompt: string,
  variables: Record<string, string | number>
): string {
  let result = prompt;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(`{${key}}`, String(value));
  }
  return result;
}
