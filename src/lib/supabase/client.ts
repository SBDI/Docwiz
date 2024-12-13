import { createClient } from '@supabase/supabase-js'
import { Database } from '../database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env file')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
})

// Helper to handle Supabase errors
export const handleSupabaseError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// Type-safe query helpers
export const queries = {
  profiles: {
    getProfile: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    },
    updateProfile: async (userId: string, updates: Database['public']['Tables']['profiles']['Update']) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },
  quizzes: {
    getQuizzes: async (userId: string) => {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          questions (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    getQuiz: async (quizId: string) => {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          questions (*)
        `)
        .eq('id', quizId)
        .single()
      
      if (error) throw error
      return data
    },
    createQuiz: async (quiz: Database['public']['Tables']['quizzes']['Insert']) => {
      const { data, error } = await supabase
        .from('quizzes')
        .insert(quiz)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    updateQuiz: async (quizId: string, updates: Database['public']['Tables']['quizzes']['Update']) => {
      const { data, error } = await supabase
        .from('quizzes')
        .update(updates)
        .eq('id', quizId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    deleteQuiz: async (quizId: string) => {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId)
      
      if (error) throw error
    }
  },
  templates: {
    getTemplates: async (filters?: { category?: string; difficulty?: string }) => {
      let query = supabase
        .from('templates')
        .select(`
          *,
          template_questions (*)
        `)
        .order('created_at', { ascending: false })

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },

    getTemplate: async (templateId: string) => {
      const { data, error } = await supabase
        .from('templates')
        .select(`
          *,
          template_questions (*)
        `)
        .eq('id', templateId)
        .single()
      
      if (error) throw error
      return data
    },

    createQuizFromTemplate: async (templateId: string, userId: string) => {
      // Start a transaction
      const { data: template, error: templateError } = await supabase
        .from('templates')
        .select(`
          *,
          template_questions (*)
        `)
        .eq('id', templateId)
        .single()

      if (templateError) throw templateError

      // Create the quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          user_id: userId,
          title: template.title,
          description: template.description,
        })
        .select()
        .single()

      if (quizError) throw quizError

      // Create the questions
      const questions = template.template_questions.map((q: any) => ({
        quiz_id: quiz.id,
        type: q.type,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        order_index: q.order_index,
      }))

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questions)

      if (questionsError) throw questionsError

      return quiz
    }
  }
} 