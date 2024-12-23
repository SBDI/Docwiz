import type { QuestionType } from '@/lib/constants'
import type { Database } from '@/lib/database.types'

export type Quiz = Database['public']['Tables']['quizzes']['Row'] & {
  questions: Question[]
}

// Question types
export type QuestionType = 'multiple-choice' | 'true-false' | 'fill-in-blank';
export type UIQuestionType = 'multiple-choice' | 'true-false' | 'open-ended';

// Database question type
export type DatabaseQuestion = {
  id: string;
  quiz_id: string;
  type: QuestionType;
  question: string;
  options: string[] | null;
  correct_answer: string;
  order_index: number;
  explanation?: string;
}

// UI question type
export type Question = {
  id: string;
  quiz_id: string;
  type: UIQuestionType;
  question: string;
  options: string[] | null;
  correct_answer: string;
  order_index: number;
  explanation?: string;
}

// Quiz question type (used in components)
export interface QuizQuestion {
  id: string;
  quiz_id: string;
  type: UIQuestionType;
  question: string;
  options: string[];
  correct_answer: string;
  order_index: number;
  explanation?: string;
}

export type QuizCreationData = Omit<Database['public']['Tables']['quizzes']['Insert'], 'id'> & {
  questions: Array<Omit<Database['public']['Tables']['questions']['Insert'], 'id' | 'quiz_id'>>
}

export interface QuizPreviewProps {
  questions: QuizQuestion[];
  onClose: () => void;
  onSave?: (title: string) => Promise<void>;
}