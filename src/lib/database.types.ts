export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          credits?: number
          created_at?: string
          updated_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          type: string
          question: string
          options: Json | null
          correct_answer: string
          explanation: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          type: string
          question: string
          options?: Json | null
          correct_answer: string
          explanation?: string | null
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          type?: string
          question?: string
          options?: Json | null
          correct_answer?: string
          explanation?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          difficulty: string
          is_premium: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          difficulty: string
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          difficulty?: string
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      template_questions: {
        Row: {
          id: string
          template_id: string
          type: string
          question: string
          options: Json | null
          correct_answer: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          template_id: string
          type: string
          question: string
          options?: Json | null
          correct_answer: string
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          template_id?: string
          type?: string
          question?: string
          options?: Json | null
          correct_answer?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 