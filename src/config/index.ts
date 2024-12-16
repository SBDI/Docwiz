// Centralize configuration
export const config = {
  ai: {
    url: import.meta.env.VITE_OLLAMA_URL,
    model: import.meta.env.VITE_MODEL_NAME,
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
  'VITE_OLLAMA_URL',
  'VITE_MODEL_NAME',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const;

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
} 