import { useState, useEffect, useCallback, useRef } from "react";
import { aiClient } from '../lib/ai-client';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { documentStorage, type StoredDocument } from "../lib/documentStorage";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { testXAI } from '../lib/api/test-api';
import type { Question, QuizQuestion, QuizCreationData } from '../types/quiz';
import { useToast } from "../components/ui/use-toast";
import QuizCardComponent from "../components/quiz/QuizCardComponent";
import OptionsDialog from "../components/quiz/OptionsDialog";
import FileUpload from "../components/quiz/FileUpload";
import { DocumentParser } from '../lib/documentParser';
import QuizTaking from "../components/quiz/QuizTaking";
import { Settings2, Loader2, Save } from "lucide-react";
import { useQuiz } from "../hooks/useQuiz";

const CreateQuiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveQuiz } = useQuiz();
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [textInput, setTextInput] = useState("");
  const [parsedContent, setParsedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<{ questions: QuizQuestion[] }>({ questions: [] });
  const [showOptions, setShowOptions] = useState(false);
  const [savedDocuments, setSavedDocuments] = useState<StoredDocument[]>([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizOptions, setQuizOptions] = useState({
    language: 'Auto Detect',
    questionType: 'Mix (All Types)',
    difficulty: 'Auto'
  });
  const [textDirection, setTextDirection] = useState<'ltr' | 'rtl' | 'auto'>('auto');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      const docs = documentStorage.getDocuments();
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

  const detectTextDirection = (text: string) => {
    // Check if the text contains Arabic characters
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    if (arabicPattern.test(text)) {
      return 'rtl';
    }
    return 'ltr';
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTextInput(newText);
    setTextDirection(detectTextDirection(newText));
  };

  const handleFileSelect = async (file: File) => {
    try {
      if (!DocumentParser.isSupported(file)) {
        throw new Error('Unsupported file type. Please upload PDF, DOCX, TXT, or MD files.');
      }

      setIsLoading(true);
      const parsedDoc = await DocumentParser.parseDocument(file);
      
      if (parsedDoc.error) {
        throw new Error(parsedDoc.error);
      }

      setParsedContent(parsedDoc.content);
      setActiveTab('file');
      
      // Set text direction based on parsed document
      if (parsedDoc.textDirection) {
        setTextDirection(parsedDoc.textDirection);
      }

      // Update quiz options based on detected language
      if (parsedDoc.language === 'ar') {
        setQuizOptions(prev => ({
          ...prev,
          language: 'Arabic'
        }));
      }
      
      // Save document with metadata
      const newDoc: StoredDocument = {
        id: uuidv4(),
        name: parsedDoc.title,
        type: parsedDoc.type,
        size: parseInt(parsedDoc.metadata?.size || '0'),
        content: parsedDoc.content,
        createdAt: Date.now(),
        pages: parsedDoc.pageCount,
      };
      
      const saved = documentStorage.saveDocument(newDoc);
      if (!saved) {
        throw new Error('Failed to save document');
      }
      
      // Refresh document list
      const docs = documentStorage.getDocuments();
      setSavedDocuments(docs);
      
      toast({
        title: "Success",
        description: `File uploaded successfully. ${parsedDoc.pageCount ? `Pages: ${parsedDoc.pageCount}.` : ''} ${parsedDoc.language === 'ar' ? 'Arabic content detected.' : ''}`,
      });
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentSelect = async (document: StoredDocument) => {
    try {
      setIsLoading(true);
      setParsedContent(document.content);
      setActiveTab('file');
      setTextDirection(detectTextDirection(document.content));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while loading the saved document",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionsSubmit = (options: any) => {
    setQuizOptions(options);
    setShowOptions(false);
  };

  const handleGenerateQuiz = async () => {
    if (!textInput && !parsedContent) {
      toast({
        title: "No Content",
        description: "Please enter some text or upload a file first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGenerationProgress(0);
    setGenerationMessage("Generating quiz...");

    try {
      const content = parsedContent || textInput;
      const questions = await aiClient.generateQuiz(content, quizOptions);
      setGeneratedQuiz({ questions });
      setQuizTitle(`Quiz - ${new Date().toLocaleDateString()}`);
      setQuizDescription(`Generated from ${activeTab === 'text' ? 'text input' : 'file upload'}`);
      setShowPreview(true);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate quiz",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setGenerationProgress(100);
      setGenerationMessage("");
    }
  };

  const handleEditQuiz = () => {
    // Implement edit functionality
    setShowOptions(true);
  };

  const handleTakeQuiz = () => {
    if (generatedQuiz.questions.length > 0) {
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = (score: number, answers: Record<string, string>) => {
    setShowQuiz(false);
    toast({
      title: "Quiz Completed!",
      description: `Your score: ${score.toFixed(0)}%`,
    });
  };

  const handleSaveQuiz = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to save quizzes",
        variant: "destructive",
      });
      return;
    }

    if (!generatedQuiz.questions.length) {
      toast({
        title: "Error",
        description: "Please generate a quiz first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Save the document if we have one
      let documentId = null;
      if (parsedContent) {
        const doc: StoredDocument = {
          id: uuidv4(),
          name: quizTitle || 'Untitled Document',
          type: activeTab === 'file' ? 'file' : 'text',
          size: new Blob([parsedContent]).size,
          content: parsedContent,
          createdAt: Date.now(),
          pages: 1,
        };
        documentStorage.saveDocument(doc);
        documentId = doc.id;
      }

      // Save the quiz
      const quizData: QuizCreationData = {
        title: quizTitle || 'Untitled Quiz',
        description: quizDescription || null,
        user_id: user.id,
        is_public: false,
        questions: generatedQuiz.questions.map((q, index) => ({
          type: 'multiple-choice',
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
          order_index: index
        }))
      };

      const quiz = await saveQuiz(quizData);
      
      toast({
        title: "Success",
        description: "Quiz saved successfully!",
      });

      // Navigate to the quiz page
      navigate(`/quiz/${quiz.id}`);
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast({
        title: "Error",
        description: "Failed to save quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
            Create Quiz
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowOptions(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings2 className="w-4 h-4" />
              Quiz Options
            </Button>
            <Button
              onClick={handleSaveQuiz}
              disabled={isLoading || !generatedQuiz.questions.length}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Quiz
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="bg-card border rounded-lg shadow-sm p-6 space-y-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'text' | 'file')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="text">Text Input</TabsTrigger>
              <TabsTrigger value="file">File Upload</TabsTrigger>
            </TabsList>

            {activeTab === 'text' ? (
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter your text here to generate quiz questions..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[300px] font-mono"
                />
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setTextInput("")}
                    disabled={!textInput}
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleGenerateQuiz}
                    disabled={isLoading || !textInput}
                    className="min-w-[140px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Quiz'
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  savedDocuments={savedDocuments}
                  onDocumentSelect={handleDocumentSelect}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleGenerateQuiz}
                    disabled={isLoading || !parsedContent}
                    className="min-w-[140px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Quiz'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Tabs>
        </div>

        {generatedQuiz.questions.length > 0 && (
          <div className="bg-card border rounded-lg shadow-sm p-6">
            <QuizCardComponent
              id={uuidv4()}
              title={quizTitle}
              description={quizDescription}
              questions={generatedQuiz.questions}
              onEdit={handleEditQuiz}
              onTakeQuiz={handleTakeQuiz}
            />
          </div>
        )}
      </div>

      <OptionsDialog
        open={showOptions}
        onOpenChange={setShowOptions}
        options={quizOptions}
        onSubmit={(newOptions) => {
          setQuizOptions(newOptions);
          setShowOptions(false);
        }}
      />

      {showQuiz && (
        <QuizTaking
          questions={generatedQuiz.questions}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default CreateQuiz;