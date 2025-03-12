import { createClient } from '@supabase/supabase-js'
import { Database } from '../database.types'

// Ensure URL has no trailing slash and is properly formatted
const supabaseUrl = 'https://lvgqigjgvhejuaglehpa.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env file')
}

// Configure Supabase client with explicit headers and options
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'docwiz',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Prefer': 'return=minimal'  // This helps with insert operations
    }
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
      // Get real quizzes from Supabase
      const { data: realQuizzes, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          questions (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error

      // In development mode, also get mock quizzes
      if (import.meta.env.VITE_DEV_BYPASS_CREDITS === 'true') {
        try {
          const mockQuizzes = JSON.parse(localStorage.getItem('mockQuizzes') || '{}');
          const userMockQuizzes = Object.values(mockQuizzes)
            .filter((quiz: any) => quiz.user_id === userId)
            .map((quiz: any) => ({
              ...quiz,
              questions: quiz.questions || [] // Ensure questions is always an array
            })) as Array<Database['public']['Tables']['quizzes']['Row'] & {
              questions: Database['public']['Tables']['questions']['Row'][]
            }>;
          
          return [...(realQuizzes || []), ...userMockQuizzes].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        } catch (e) {
          console.warn('Failed to retrieve mock quizzes from localStorage:', e);
        }
      }

      return realQuizzes || [];
    },
    getQuiz: async (quizId: string) => {
      // Check for mock quiz in development mode
      if (import.meta.env.VITE_DEV_BYPASS_CREDITS === 'true') {
        try {
          const mockQuizzes = JSON.parse(localStorage.getItem('mockQuizzes') || '{}');
          const mockQuiz = mockQuizzes[quizId];
          if (mockQuiz) {
            return {
              ...mockQuiz,
              questions: mockQuiz.questions || [] // Ensure questions is always an array
            } as Database['public']['Tables']['quizzes']['Row'] & {
              questions: Database['public']['Tables']['questions']['Row'][]
            };
          }
        } catch (e) {
          console.warn('Failed to retrieve mock quiz from localStorage:', e);
        }
      }

      // If no mock quiz found or not in development mode, proceed with normal fetch
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          questions:questions(
            id,
            type,
            question,
            options,
            correct_answer,
            explanation,
            order_index
          )
        `)
        .eq('id', quizId)
        .single()
      
      if (error) throw error
      return {
        ...data,
        questions: data.questions || [] // Ensure questions is always an array
      } as Database['public']['Tables']['quizzes']['Row'] & {
        questions: Database['public']['Tables']['questions']['Row'][]
      };
    },
    saveQuiz: async (quiz: Omit<Database['public']['Tables']['quizzes']['Insert'], 'id'> & { 
      questions?: Array<Omit<Database['public']['Tables']['questions']['Insert'], 'id' | 'quiz_id'>> 
    }) => {
      const { questions, ...quizData } = quiz;

      try {
        // First, try to insert the quiz without selecting
        const { error: insertError } = await supabase
          .from('quizzes')
          .insert({
            ...quizData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          // Check specifically for insufficient credits error
          if (insertError.message.includes('Insufficient credits')) {
            const bypassCredits = import.meta.env.VITE_DEV_BYPASS_CREDITS === 'true';
            
            if (bypassCredits) {
              console.warn('Credit check bypassed for development');
              
              // For development: Bypass credit check and create quiz anyway
              // Create a unique ID for the quiz
              const bypassedQuizId = crypto.randomUUID();
              
              // Create mock quiz data with the same structure as a real quiz
              const mockQuizData: Database['public']['Tables']['quizzes']['Row'] & {
                questions: Database['public']['Tables']['questions']['Row'][]
              } = {
                id: bypassedQuizId,
                user_id: quizData.user_id,
                title: quizData.title,
                description: quizData.description || null,
                is_public: quizData.is_public || false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                questions: questions?.map((q, index) => ({
                  id: crypto.randomUUID(),
                  quiz_id: bypassedQuizId,
                  type: q.type,
                  question: q.question,
                  options: q.options || null,
                  correct_answer: q.correct_answer,
                  explanation: q.explanation || null,
                  order_index: index,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })) || []
              };
              
              // Store the mock quiz in localStorage for persistence during development
              try {
                const mockQuizzes = JSON.parse(localStorage.getItem('mockQuizzes') || '{}');
                mockQuizzes[bypassedQuizId] = mockQuizData;
                localStorage.setItem('mockQuizzes', JSON.stringify(mockQuizzes));
              } catch (e) {
                console.warn('Failed to store mock quiz in localStorage:', e);
              }
              
              return mockQuizData;
            } else {
              throw new Error('Unable to create quiz: You have insufficient credits. Please purchase more credits to continue.');
            }
          }
          throw insertError;
        }

        // Then fetch the newly created quiz separately
        const { data: savedQuiz, error: fetchError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('user_id', quizData.user_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (fetchError || !savedQuiz) {
          throw new Error('Failed to retrieve saved quiz');
        }

        if (questions && questions.length > 0) {
          // Prepare questions with quiz_id and ensure all required fields
          const questionsWithQuizId = questions.map((q, index) => {
            // Validate required fields
            if (!q.type || !q.question || !q.correct_answer) {
              throw new Error('Missing required fields in question');
            }

            return {
              quiz_id: savedQuiz.id,
              type: q.type,
              question: q.question,
              options: q.options || null,
              correct_answer: q.correct_answer,
              explanation: q.explanation || null,
              order_index: index,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          });

          // Insert questions
          const { error: questionsError } = await supabase
            .from('questions')
            .insert(questionsWithQuizId);

          if (questionsError) {
            // If questions fail to insert, delete the quiz to maintain consistency
            await supabase.from('quizzes').delete().eq('id', savedQuiz.id);
            throw questionsError;
          }
        }

        // Return complete quiz with questions
        const { data: completeQuiz, error: completeError } = await supabase
          .from('quizzes')
          .select(`
            id,
            user_id,
            title,
            description,
            is_public,
            created_at,
            updated_at,
            questions(
              id,
              type,
              question,
              options,
              correct_answer,
              explanation,
              order_index,
              created_at,
              updated_at
            )
          `)
          .eq('id', savedQuiz.id)
          .single();

        if (completeError || !completeQuiz) {
          throw new Error('Failed to retrieve complete quiz');
        }

        return {
          ...completeQuiz,
          questions: completeQuiz.questions || []
        } as Database['public']['Tables']['quizzes']['Row'] & {
          questions: Database['public']['Tables']['questions']['Row'][]
        };
      } catch (error) {
        console.error('Error saving quiz:', error);
        throw error;
      }
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
  questions: {
    updateExplanation: async (questionId: string, explanation: string) => {
      const { error } = await supabase
        .from('questions')
        .update({ explanation })
        .eq('id', questionId);

      if (error) throw error;
    },
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