import { config } from '@/config'

export async function testXAI() {
  try {
    console.log('Testing X.AI API connection...');

    if (!config.ai.apiKey) {
      throw new Error('X.AI API key is not configured');
    }

    const response = await fetch(`${config.ai.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.ai.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: config.ai.model,
        messages: [
          {
            role: "system",
            content: "You are a test assistant."
          },
          {
            role: "user",
            content: "Testing. Just say hi and nothing else."
          }
        ],
        temperature: 0
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error?.message || `API request failed: ${response.status}`);
    }

    console.log('API Response:', data);
    return {
      success: true,
      message: data.choices?.[0]?.message?.content || 'No response content',
      model: data.model,
      usage: data.usage
    };
  } catch (error) {
    console.error('API Test Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
