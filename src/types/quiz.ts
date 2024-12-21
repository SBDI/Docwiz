import type { QuestionType } from '@/lib/constants'
import type { Database } from '@/lib/database.types'

export type Quiz = Database['public']['Tables']['quizzes']['Row'] & {
  questions: Question[]
}

export type Question = {
  id: string
  quiz_id: string
  type: QuestionType
  question: string
  options: string[] | null
  correct_answer: string
  order_index: number
}

export type QuizCreationData = Omit<Database['public']['Tables']['quizzes']['Insert'], 'id'> & {
  questions: Array<Omit<Database['public']['Tables']['questions']['Insert'], 'id' | 'quiz_id'>>
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  question: string;
  options: string[];
  correct_answer: string;
  order_index: number;
  explanation?: string;
}

export interface QuizPreviewProps {
  questions: QuizQuestion[];
  onClose: () => void;
  onSave?: (title: string) => Promise<void>;
}