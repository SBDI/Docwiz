import type { Question } from './quiz'
import type { Database } from '@/lib/database.types'

export type Template = Database['public']['Tables']['templates']['Row'] & {
  template_questions: Question[]
}

export type TemplateFilters = {
  category?: string
  difficulty?: string
  isPremium?: boolean
} 