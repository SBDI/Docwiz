// Centralize configuration
export const config = {
  ai: {
    url: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:3456',
    model: import.meta.env.VITE_MODEL_NAME || 'tinyllama:1.1b-chat',
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  app: {
    name: 'Docwiz',
    version: '1.0.0',
  }
} 