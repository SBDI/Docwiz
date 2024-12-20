import { useState } from 'react';
import { aiClient } from '@/lib/groq';
import { Button } from '@/components/ui/button';

export function TestGroqApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testApi = async () => {
    setIsLoading(true);
    setResult('Testing...');
    try {
      await aiClient.testApiKey();
      setResult('Success! API key is working correctly.');
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Button 
        onClick={testApi} 
        disabled={isLoading}
      >
        {isLoading ? 'Testing...' : 'Test X.AI API Key'}
      </Button>
      {result && (
        <div className={`p-4 rounded-md ${
          result.startsWith('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {result}
        </div>
      )}
    </div>
  );
}
