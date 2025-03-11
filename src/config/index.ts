// Centralize configuration
export const config = {
  ai: {
    model: 'mixtral-8x7b-32768', // Using one of Groq's available models
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    baseUrl: 'https://api.groq.com/v1'
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

// Add validation for required environment variables
const requiredEnvVars = [
  'VITE_GROQ_API_KEY',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const;

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}