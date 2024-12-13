import { Database } from "@/integrations/supabase/types";

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  question: string;
  options?: string[];
  correctAnswer: string | number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export type QuizResponse = Database['public']['Tables']['quizzes']['Row']; 