import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { documentStorage, type StoredDocument } from "@/lib/documentStorage";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import OptionsDialog from "@/components/quiz/OptionsDialog";
import { Input } from "@/components/ui/input";
import PageSelectionDialog from "@/components/quiz/PageSelectionDialog";
import { DocumentParser } from '@/lib/documentParser';
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabase'
import QuizPreview from '@/components/quiz/QuizPreview';
import type { QuizGenerationResponse } from '@/lib/api.types';
import { testOllamaConnection } from '@/lib/ollama'
import { testTinyLlama } from '@/lib/ollama'
import { ollamaClient } from '@/lib/ollama'

const inputTypes = [
  {
    value: 'document',
    label: 'Document',
    icon: (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    value: 'text',
    label: 'Text',
    icon: (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    )
  },
  {
    value: 'image',
    label: 'Image',
    icon: (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    value: 'video',
    label: 'Video',
    icon: (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    value: 'webpage',
    label: 'Webpage',
    icon: (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  }
];

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // Group all state declarations together before any logic
  const [activeTab, setActiveTab] = useState('document');
  const [showOptions, setShowOptions] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [showPageSelection, setShowPageSelection] = useState(false);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedContent, setParsedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationMessage, setGenerationMessage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizGenerationResponse | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Refs after state declarations
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect for authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/sign-in');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await testOllamaConnection();
      if (!isConnected) {
        toast({
          title: "Ollama Connection Error",
          description: "Make sure Ollama is running (ollama serve)",
          variant: "destructive",
        });
      } else {
        console.log("Connected to Ollama successfully!");
      }
    };

    checkConnection();
  }, []);

  const handleGenerate = async (content: string) => {
    setIsGenerating(true)
    try {
      const quiz = await ollamaClient.generateQuiz(content)
      
      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          questions: quiz,
          content: content,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      
      return data
    } catch (error) {
      console.error('Failed to create quiz:', error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

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

      setGenerationMessage("Model is loading, please wait...");
      setGenerationProgress(50);

      const quiz = await ollamaClient.generateQuiz(content);
      setGeneratedQuiz({ questions: quiz });
      
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

  const simulateProgress = async (start: number, end: number) => {
    const duration = 1000; // 1 second
    const steps = 10;
    const increment = (end - start) / steps;
    
    for (let i = 0; i <= steps; i++) {
      setGenerationProgress(Math.min(start + (increment * i), end));
      await new Promise(resolve => setTimeout(resolve, duration / steps));
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setTextInput(text);
    setCharacterCount(text.length);
  };

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    setIsProcessing(true);
    setUploadProgress(0);
    setParseError(null);

    try {
      // Simulate file reading progress
      await simulateProgress(0, 40);
      setUploadProgress(40);

      // Parse the document
      const parsedDoc = await DocumentParser.parseDocument(file);
      
      setUploadProgress(70);
      await simulateProgress(70, 90);

      // Store document info
      const doc: StoredDocument = {
        id: uuidv4(),
        name: file.name,
        type: file.type,
        size: file.size,
        pages: parsedDoc.pageCount,
        content: parsedDoc.content,
        createdAt: Date.now(),
      };

      documentStorage.saveDocument(doc);
      setFileInput(file);
      setParsedContent(parsedDoc.content);

      // If it's a PDF and has pages, show page selection
      if (parsedDoc.pageCount) {
        setShowPageSelection(true);
      } else {
        // For DOCX or other files, proceed directly
        setTextInput(parsedDoc.content);
        setCharacterCount(parsedDoc.content.length);
      }

      setUploadProgress(100);
      
      toast({
        title: "File Uploaded",
        description: "Your file has been processed successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error('Error processing file:', error);
      setParseError(error instanceof Error ? error.message : 'Failed to process file');
      
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  }, [toast]);

  const handlePageSelection = (pages: number[]) => {
    if (!fileInput) return;

    const doc = documentStorage.getDocuments().find(d => d.name === fileInput.name);
    if (doc) {
      doc.selectedPages = pages;
      documentStorage.saveDocument(doc);
    }
    setSelectedPages(pages);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  // Add file input click handler
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Update handleFileUpload to work with input change event
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const renderUploadProgress = () => {
    if (!isProcessing) return null;

    return (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600">Processing document... {uploadProgress}%</p>
        </div>
      </div>
    );
  };

  // Add error display to the UI
  const renderError = () => {
    if (!parseError) return null;

    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{parseError}</span>
      </div>
    );
  };

  const renderContent = () => {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (!user) {
      return null;
    }

    const containerClasses = "flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-[#E2E8F0] rounded-lg p-8 bg-[#F8FAFC]";
    
    const renderGenerateButton = () => (
      <div className="flex justify-between items-center mt-6">
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
          onClick={handleSubmit}
          disabled={
            isLoading || 
            (activeTab === 'text' && characterCount === 0) ||
            (activeTab === 'video' && !urlInput) ||
            (activeTab === 'webpage' && !urlInput) ||
            ((activeTab === 'document' || activeTab === 'image') && !parsedContent)
          }
        >
          {isLoading ? "Generating..." : "Generate Quiz"}
        </Button>
        {activeTab === 'text' && (
          <span className="text-[#64748B] text-sm">
            {characterCount}/20,000 characters
          </span>
        )}
      </div>
    );

    switch (activeTab) {
      case 'text':
        return (
          <div className="flex flex-col gap-6">
            <div className={containerClasses}>
              <div className="max-w-xl w-full">
                <Textarea
                  placeholder="Paste in your notes or other content"
                  className="w-full min-h-[300px] bg-transparent border-none text-[#64748B] resize-none p-4 focus-visible:ring-0 placeholder:text-[#64748B]"
                  value={textInput}
                  onChange={handleTextChange}
                />
              </div>
            </div>
            {renderGenerateButton()}
          </div>
        );

      case 'video':
        return (
          <div className="flex flex-col gap-6">
            <div className={containerClasses}>
              <div className="max-w-xl w-full space-y-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-full h-full text-[#64748B]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-[#2D3648]">
                    Paste in a link to a YouTube video
                  </h3>
                  <Input
                    type="url"
                    placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="w-full bg-white border-[#E2E8F0] text-[#64748B] h-12"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {renderGenerateButton()}
          </div>
        );

      case 'webpage':
        return (
          <div className="flex flex-col gap-6">
            <div className={containerClasses}>
              <div className="max-w-xl w-full space-y-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-full h-full text-[#64748B]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-[#2D3648]">
                    Paste in a link to a webpage
                  </h3>
                  <Input
                    type="url"
                    placeholder="e.g. https://example.com/article"
                    className="w-full bg-white border-[#E2E8F0] text-[#64748B] h-12"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {renderGenerateButton()}
          </div>
        );

      case 'document':
      case 'image':
        return (
          <div className="flex flex-col gap-6">
            {renderError()}
            <div
              onClick={handleFileInputClick}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={containerClasses}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={activeTab === 'image' ? 'image/*' : '.pdf,.doc,.docx'}
              />
              <div className="max-w-xl w-full">
                <div className="flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-16 h-16">
                    {isProcessing ? (
                      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg
                        className="w-full h-full text-[#94A3B8]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-[#64748B] text-lg">
                    {activeTab === 'image' 
                      ? 'Drag an image here or click to upload'
                      : 'Drag a document here or click to browse'
                    }
                  </p>
                  {isProcessing && (
                    <div className="mt-2">
                      <p className="text-sm text-indigo-600">Processing... {uploadProgress}%</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {parsedContent && !showPageSelection && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Document Preview</h3>
                  <div className="max-h-[300px] overflow-y-auto p-4 bg-gray-50 rounded-lg">
                    <pre className="whitespace-pre-wrap font-sans">
                      {parsedContent.slice(0, 1000)}...
                    </pre>
                  </div>
                </div>
            )}
            {renderGenerateButton()}
          </div>
        );

      default:
        return null;
    }
  };

  const handleSaveQuiz = async (title: string) => {
    if (!generatedQuiz) return;

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          title,
          questions: generatedQuiz.questions,
          created_at: new Date().toISOString(),
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      navigate(`/quiz/${data.id}`);
    } catch (error) {
      console.error('Failed to save quiz:', error);
      throw error;
    }
  };

  if (showPreview && generatedQuiz) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <QuizPreview 
          questions={generatedQuiz.questions}
          onClose={() => setShowPreview(false)}
          onSave={handleSaveQuiz}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-[#2D3648]">Docwiz Quiz Generator</h1>
          <p className="text-[#64748B]">
            Upload a document, paste your notes, or select a video to automatically generate a quiz with AI.
          </p>
        </div>

        <div className="flex justify-between items-center">
          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
            <TabsList className="bg-[#F8FAFC] p-1 h-auto">
              {inputTypes.map((type) => (
                <TabsTrigger 
                  key={type.value}
                  value={type.value} 
                  className="data-[state=active]:bg-white rounded-md px-6 py-2 flex items-center"
                >
                  {type.icon}
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button 
            variant="outline" 
            className="rounded-full ml-4 border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#64748B]"
            onClick={() => setShowOptions(true)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Options
          </Button>
        </div>

        {renderContent()}

        <OptionsDialog 
          open={showOptions} 
          onOpenChange={setShowOptions}
        />

        <PageSelectionDialog
          open={showPageSelection}
          onOpenChange={setShowPageSelection}
          totalPages={fileInput ? (documentStorage.getDocument(fileInput.name)?.pages || 0) : 0}
          onConfirm={handlePageSelection}
        />

        {isLoading && (
          <LoadingOverlay 
            progress={generationProgress}
            message={generationMessage}
            subMessage="This may take a few moments..."
          />
        )}

        <Button 
          onClick={async () => {
            const isWorking = await testTinyLlama();
            toast({
              title: isWorking ? "Test Successful" : "Test Failed",
              description: isWorking 
                ? "TinyLlama is working correctly!" 
                : "Failed to generate test question",
              variant: isWorking ? "success" : "destructive",
            });
          }}
        >
          Test TinyLlama
        </Button>
      </div>
    </div>
  );
};

export default CreateQuiz; 