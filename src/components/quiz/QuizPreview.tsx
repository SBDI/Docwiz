import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { QuizQuestion, QuizPreviewProps } from '@/types/quiz';
import { useHotkeys } from 'react-hotkeys-hook';
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const QuizPreview = ({ questions, onClose }: QuizPreviewProps) => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    questionRef.current?.focus();
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  }, [currentQuestion, questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  useHotkeys('right', handleNext, [handleNext]);
  useHotkeys('left', handlePrevious, [handlePrevious]);
  useHotkeys('esc', onClose, [onClose]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const detectTextDirection = (text: string) => {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicPattern.test(text) ? 'rtl' : 'ltr';
  };

  const renderQuestion = (question: QuizQuestion) => {
    const dir = detectTextDirection(question.question);
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className={`w-full ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <div 
              className="mb-4 text-lg font-medium" 
              dir={dir}
              style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}
            >
              {question.question}
            </div>
            <RadioGroup
              dir={dir}
              value={answers[question.id]}
              onValueChange={(value) => handleAnswer(question.id, value)}
              className="space-y-3"
            >
              {question.options?.map((option, index) => (
                <div 
                  key={index} 
                  className={`flex items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''} gap-2 w-full`}
                  dir={dir}
                >
                  <Label 
                    htmlFor={`option-${index}`}
                    className="text-gray-700 flex-grow"
                    style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}
                  >
                    {option}
                  </Label>
                  <div className={`flex items-center ${dir === 'rtl' ? 'mr-auto' : 'ml-auto'}`}>
                    <RadioGroupItem value={option} id={`option-${index}`} />
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'true-false':
        return (
          <RadioGroup
            dir={dir}
            value={answers[question.id]}
            onValueChange={(value) => handleAnswer(question.id, value)}
            className="space-y-3"
          >
            <div 
              className={`flex items-center space-x-2 ${dir === 'rtl' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <RadioGroupItem value="true" id="true" />
              <Label 
                htmlFor="true"
                className="text-gray-700"
                style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}
              >
                True
              </Label>
            </div>
            <div 
              className={`flex items-center space-x-2 ${dir === 'rtl' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <RadioGroupItem value="false" id="false" />
              <Label 
                htmlFor="false"
                className="text-gray-700"
                style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}
              >
                False
              </Label>
            </div>
          </RadioGroup>
        );

      case 'open-ended':
        return (
          <Input
            dir={dir}
            placeholder="Type your answer here..."
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            className="mt-2"
          />
        );

      default:
        return null;
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });
    return {
      score: correctAnswers,
      total: questions.length,
      percentage: Math.round((correctAnswers / questions.length) * 100)
    };
  };

  const handleSubmit = async () => {
    const results = calculateScore();
    setScore(results.percentage);
    setShowResults(true);

    toast({
      title: "Quiz Completed!",
      description: `Your score: ${results.percentage}% (${results.score}/${results.total} correct)`,
      variant: "success",
    });
  };

  return (
    <Dialog open onOpenChange={onClose} className="max-w-4xl">
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quiz Preview</DialogTitle>
          <DialogDescription>
            Review the quiz questions and answers before proceeding
          </DialogDescription>
          <div className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </DialogHeader>

        <div className="py-4" ref={questionRef} tabIndex={-1}>
          {renderQuestion(questions[currentQuestion])}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close Preview
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentQuestion === questions.length - 1}
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizPreview;