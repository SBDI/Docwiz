import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { queries } from '@/lib/supabase/client'
import type { Quiz, QuizCreationData } from '@/types/quiz'
import { toast } from 'sonner'

export function useQuiz() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const saveQuiz = async (data: QuizCreationData) => {
    setLoading(true)
    try {
      const quiz = await queries.quizzes.saveQuiz(data)
      toast.success('Quiz saved successfully!')
      navigate(`/quiz/${quiz.id}/edit`)
      return quiz
    } catch (error) {
      toast.error('Failed to save quiz')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateQuiz = async (quizId: string, data: Partial<Quiz>) => {
    setLoading(true)
    try {
      const quiz = await queries.quizzes.updateQuiz(quizId, data)
      toast.success('Quiz updated successfully!')
      return quiz
    } catch (error) {
      toast.error('Failed to update quiz')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    saveQuiz,
    updateQuiz
  }
} 