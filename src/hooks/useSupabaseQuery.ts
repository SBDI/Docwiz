import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js'

export function useSupabaseQuery<T>(
  queryBuilder: () => PostgrestFilterBuilder<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data, error } = await queryBuilder()
        if (error) throw error
        setData(data)
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, deps)

  return { data, loading, error }
} 