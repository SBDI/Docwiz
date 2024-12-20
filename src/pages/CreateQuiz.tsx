import { useState, useEffect, useCallback, useRef } from "react";
import { aiClient } from '@/lib/ai-client';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { documentStorage, type StoredDocument } from "@/lib/documentStorage";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { testXAI } from '@/lib/api/test-api';
import type { Question, QuizQuestion } from '@/types/quiz';
import { useToast } from "@/components/ui/use-toast";
import QuizPreview from "@/components/quiz/QuizPreview";
import OptionsDialog from "@/components/quiz/OptionsDialog";
import FileUpload from "@/components/quiz/FileUpload";

const CreateQuiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [textInput, setTextInput] = useState("");
  const [parsedContent, setParsedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<{ questions: QuizQuestion[] }>({ questions: [] });
  const [showOptions, setShowOptions] = useState(false);
  const [savedDocuments, setSavedDocuments] = useState<StoredDocument[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      const docs = await documentStorage.getAll();
      setSavedDocuments(docs);
    };
    loadDocuments();
  }, []);

  useEffect(() => {
    const testApi = async () => {
      try {
        const result = await testXAI();
        if (result.success) {
          console.log('API test successful:', result.message);
        } else {
          console.error('API test failed:', result.message);
        }
      } catch (error) {
        console.error('API test error:', error);
      }
    };
    
    testApi();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  const handleFileSelect = async (file: File) => {
    try {
      const content = await file.text();
      setParsedContent(content);
      setActiveTab('file');
      
      // Save document
      await documentStorage.save({
        id: uuidv4(),
        name: file.name,
        content,
        type: file.type,
        created_at: new Date().toISOString()
      });
      
      // Refresh document list
      const docs = await documentStorage.getAll();
      setSavedDocuments(docs);
      
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: "Error",
        description: "Failed to read file content",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      setGenerationMessage("Analyzing content...");
      setGenerationProgress(30);

      const content = activeTab === 'text' ? textInput : parsedContent;
      
      if (!content) {
        throw new Error('No content provided');
      }

      setGenerationMessage("Generating quiz with X.AI...");
      setGenerationProgress(50);

      const quiz = await aiClient.generateQuiz(content);
      const formattedQuiz: QuizQuestion[] = quiz.map((q, index) => ({
        id: String(index),
        quiz_id: '0',
        type: 'multiple-choice',
        question: q.question,
        options: q.options || [],
        correct_answer: q.correct_answer,
        order_index: index
      }));
      
      setGeneratedQuiz({ questions: formattedQuiz });
      setGenerationMessage("Quiz generated!");
      setGenerationProgress(100);

      setShowPreview(true);

      toast({
        title: "Quiz Generated Successfully",
        description: "Your quiz is ready to preview!",
        variant: "success",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate quiz",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setGenerationProgress(0);
      setGenerationMessage("");
    }
  };

  const handleTestAPI = async () => {
    try {
      const result = await testXAI();
      if (result.success) {
        toast({
          title: "API Test Successful",
          description: `Response: ${result.message}`,
          variant: "success",
        });
      } else {
        toast({
          title: "API Test Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "API Test Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create Quiz</h1>
          <Button
            onClick={handleTestAPI}
            variant="outline"
            size="sm"
          >
            Test API Connection
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'text' | 'file')}>
          <TabsList className="mb-4">
            <TabsTrigger value="text">Enter Text</TabsTrigger>
            <TabsTrigger value="file">Upload File</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'text' ? (
              <Textarea
                value={textInput}
                onChange={handleTextChange}
                placeholder="Enter your content here..."
                className="min-h-[200px]"
              />
            ) : (
              <div className="space-y-4">
                <FileUpload onFileSelect={handleFileSelect} />
                {parsedContent && (
                  <Textarea
                    value={parsedContent}
                    readOnly
                    className="min-h-[200px]"
                  />
                )}
              </div>
            )}

            <div className="flex justify-between items-center">
              <Button
                type="submit"
                disabled={isLoading || (!textInput && !parsedContent)}
              >
                {isLoading ? "Generating..." : "Generate Quiz"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowOptions(true)}
              >
                Options
              </Button>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-primary rounded transition-all duration-500"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">{generationMessage}</p>
              </div>
            )}
          </form>
        </Tabs>

        {showPreview && (
          <QuizPreview
            questions={generatedQuiz.questions}
            onClose={() => setShowPreview(false)}
          />
        )}

        {showOptions && (
          <OptionsDialog
            open={showOptions}
            onOpenChange={setShowOptions}
          />
        )}
      </div>
    </div>
  );
};

export default CreateQuiz;