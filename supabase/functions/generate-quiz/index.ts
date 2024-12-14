import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface GenerateQuizRequest {
  content: string
  userId: string
  title?: string
}

const OLLAMA_URL = 'http://localhost:11434'

serve(async (req) => {
  try {
    const { content, userId, title } = await req.json() as GenerateQuizRequest
    const supabase = createClient(
      Deno.env.get('VITE_SUPABASE_URL') ?? '',
      Deno.env.get('VITE_SUPABASE_ANON_KEY') ?? ''
    )

    // Generate quiz using Ollama
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: Deno.env.get('OLLAMA_MODEL'),
        prompt: content,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate quiz')
    }

    const result = await response.json()

    return new Response(
      JSON.stringify({ questions: result.response }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
}) 