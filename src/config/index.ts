// Centralize configuration
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL,
    timeout: 10000,
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  app: {
    name: 'Quizly Spark',
    version: '1.0.0',
  }
} 