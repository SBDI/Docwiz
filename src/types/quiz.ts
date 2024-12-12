import { Database } from "@/integrations/supabase/types";

export interface Quiz {
  id: number;
  name: string;
  source: "Text Input" | "Document" | "Web Link";
  date: string;
  questions: number;
  user_id: string;
  created_at: string;
}

export type QuizResponse = Database['public']['Tables']['quizzes']['Row']; 