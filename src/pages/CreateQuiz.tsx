import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { aiClient } from "@/lib/ai-client";
import { useQuiz } from "@/hooks/useQuiz";
import { DocumentParser } from '@/lib/documentParser';
import { FileUpload } from '@/components/quiz/FileUpload';
import type { Question } from '@/types/quiz';
import {
  QUESTION_TYPES,
  QUESTION_TYPE_LABELS,
  DIFFICULTY_LEVELS,
  LANGUAGES,
  type QuestionType,
  type DifficultyLevel,
  type Language
} from '@/lib/constants';

export default function CreateQuiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveQuiz } = useQuiz();

  const [contentType, setContentType] = useState<'Topic' | 'Text' | 'PDF'>('Topic');
  const [content, setContent] = useState("");
  const [numQuestions, setNumQuestions] = useState("5");
  const [numOptions, setNumOptions] = useState("4");
  const [questionType, setQuestionType] = useState<QuestionType>('multiple-choice');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [language, setLanguage] = useState<Language>('English');
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  const handleFileUpload = async (file: File) => {
    try {
      if (!DocumentParser.isSupported(file)) {
        throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
      }

      setIsLoading(true);
      const parsedDoc = await DocumentParser.parseDocument(file);

      if (parsedDoc.error) {
        throw new Error(parsedDoc.error);
      }

      setContent(parsedDoc.content);

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!content || content.trim().length === 0) {
      toast({
        title: "Content Required",
        description: "Please enter some content to generate questions from.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Sanitize and prepare content
      const sanitizedContent = content.trim();

      const questions = await aiClient.generateQuiz(sanitizedContent, {
        language,
        questionType,
        difficulty,
        numberOfQuestions: parseInt(numQuestions),
        numberOfOptions: parseInt(numOptions),
      });

      if (!questions || questions.length === 0) {
        throw new Error('No questions were generated. Please try again.');
      }

      setGeneratedQuestions(questions);

      // Save quiz if user is logged in
      if (user) {
        const quizData = {
          title: contentType === 'Topic' ? sanitizedContent.slice(0, 100) : `Quiz - ${new Date().toLocaleDateString()}`,
          description: description || null,
          user_id: user.id,
          is_public: false,
          questions: questions.map((q, index) => ({
            question: q.question,
            type: questionType,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            order_index: index
          }))
        };

        const savedQuiz = await saveQuiz(quizData);

        toast({
          title: "Success",
          description: "Quiz generated and saved successfully!",
        });

        navigate(`/quiz/${savedQuiz.id}`, {
          replace: true,
          state: { quiz: savedQuiz }
        });
      } else {
        toast({
          title: "Success",
          description: "Quiz generated! Sign in to save it.",
        });
      }
    } catch (error) {
      console.error('Quiz generation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionTypeChange = (value: QuestionType) => {
    setQuestionType(value);
    if (value === 'true-false') {
      setNumOptions('2');
    } else if (value === 'fill-in-blank') {
      setNumOptions('1');
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Create Quiz</h1>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Content Type</label>
          <div className="flex gap-2">
            <Button
              variant={contentType === 'Topic' ? 'default' : 'outline'}
              onClick={() => setContentType('Topic')}
            >
              Topic
            </Button>
            <Button
              variant={contentType === 'Text' ? 'default' : 'outline'}
              onClick={() => setContentType('Text')}
            >
              Text
            </Button>
            <Button
              variant={contentType === 'PDF' ? 'default' : 'outline'}
              onClick={() => setContentType('PDF')}
            >
              Document
            </Button>
          </div>
        </div>

        {contentType === 'PDF' ? (
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Document (PDF or DOCX)</label>
            <FileUpload onFileSelect={handleFileUpload} />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {contentType === 'Topic' ? 'Enter Topic' : 'Enter Text'}
            </label>
            <Textarea
              placeholder={
                contentType === 'Topic'
                  ? "Enter your topic here..."
                  : "Enter your text content here..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
              disabled={isLoading}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              How Many Questions? (1-10)
            </label>
            <Input
              type="number"
              min="1"
              max="10"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              * Upgrade to unlock up to 50 questions.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Options</label>
            <Input
              type="number"
              min="2"
              max="6"
              value={numOptions}
              onChange={(e) => setNumOptions(e.target.value)}
              disabled={isLoading || questionType !== 'multiple-choice'}
              className={questionType === 'fill-in-blank' ? 'opacity-50' : ''}
            />
            {questionType === 'fill-in-blank' && (
              <p className="text-xs text-muted-foreground">
                Not applicable for fill-in-blank questions
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Question Type</label>
            <Select
              value={questionType}
              onValueChange={handleQuestionTypeChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple-choice">
                  {QUESTION_TYPE_LABELS['multiple-choice']}
                </SelectItem>
                <SelectItem value="true-false">
                  {QUESTION_TYPE_LABELS['true-false']}
                </SelectItem>
                <SelectItem value="fill-in-blank">
                  {QUESTION_TYPE_LABELS['fill-in-blank']}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <Select
              value={difficulty}
              onValueChange={(value: DifficultyLevel) => setDifficulty(value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Output Language</label>
          <Select
            value={language}
            onValueChange={(value: Language) => setLanguage(value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description (Optional)</label>
          <Textarea
            placeholder="Specify key knowledge points or skills this quiz aims to assess."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={isLoading || !content.trim()}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating your quiz...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <span>Generate Quiz</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}