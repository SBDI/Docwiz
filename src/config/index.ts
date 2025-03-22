// Centralize configuration
export const config = {
  ai: {
    model: import.meta.env.VITE_GROQ_MODEL || 'llama3-8b-8192', // Use model from env or fallback
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    baseUrl: 'https://api.groq.com/openai/v1'
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