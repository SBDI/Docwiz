import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Question } from '@/types/quiz';
import { useHotkeys } from 'react-hotkeys-hook';

interface QuizPreviewProps {
  questions: Question[];
  onClose: () => void;
}

const QuizPreview = ({ questions, onClose }: QuizPreviewProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const questionRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    questionRef.current?.focus();
  }, [currentQuestion]);

  // Keyboard navigation
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

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <RadioGroup
            value={answers[question.id]}
            onValueChange={(value) => handleAnswer(question.id, value)}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-gray-700">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'true-false':
        return (
          <RadioGroup
            value={answers[question.id]}
            onValueChange={(value) => handleAnswer(question.id, value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="text-gray-700">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="text-gray-700">False</Label>
            </div>
          </RadioGroup>
        );

      case 'open-ended':
        return (
          <Input
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

  return (
    <div 
      role="region" 
      aria-label="Quiz preview"
      className="min-h-[600px] flex flex-col"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Quiz Preview</h2>
          <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Exit Preview
        </Button>
      </div>

      <Card className="flex-1 p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {questions[currentQuestion].type.replace('-', ' ')}
            </span>
            <h3 className="text-lg font-medium text-gray-900">
              {questions[currentQuestion].question}
            </h3>
          </div>

          <div className="py-4">
            {renderQuestion(questions[currentQuestion])}
          </div>
        </div>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <div className="flex gap-2">
          {currentQuestion === questions.length - 1 ? (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                // Handle quiz submission
                console.log('Quiz submitted:', answers);
              }}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
            >
              Next
            </Button>
          )}
        </div>
      </div>

      <div 
        ref={questionRef}
        tabIndex={0}
        role="group"
        aria-label={`Question ${currentQuestion + 1} of ${questions.length}`}
        className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
      >
        {/* ... question content ... */}
      </div>
    </div>
  );
};

export default QuizPreview; 