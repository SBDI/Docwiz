export class APIError extends Error {
  constructor(
    message: string,
    public status: number = 400,
    public code: string = 'UNKNOWN_ERROR'
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export const errorHandler = (error: unknown) => {
  if (error instanceof APIError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code
      }),
      { 
        status: error.status,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  console.error('Unhandled error:', error)
  return new Response(
    JSON.stringify({
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }),
    { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  )
} 