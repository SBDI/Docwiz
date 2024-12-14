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
  DialogFooter,
} from "@/components/ui/dialog";

const QuizPreview = ({ questions, onClose, onSave }: QuizPreviewProps) => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
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

  const renderQuestion = (question: QuizQuestion) => {
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

  const handleSave = async () => {
    if (!quizTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your quiz",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSave?.(quizTitle);
      toast({
        title: "Success",
        description: "Quiz saved successfully!",
        variant: "success",
      });
      setShowSaveDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add save dialog
  const renderSaveDialog = () => (
    <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Quiz</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="quiz-title">Quiz Title</Label>
          <Input
            id="quiz-title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter a title for your quiz"
            className="mt-2"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Quiz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Update the header to include a save button
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Quiz Preview</h2>
        <p className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>
      <div className="flex gap-2">
        {onSave && (
          <Button variant="outline" onClick={() => setShowSaveDialog(true)}>
            Save Quiz
          </Button>
        )}
        <Button variant="outline" onClick={onClose}>
          Exit Preview
        </Button>
      </div>
    </div>
  );

  // If showing results, render the results screen
  if (showResults) {
    return (
      <div className="min-h-[600px] flex flex-col">
        <Card className="flex-1 p-6">
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Quiz Results</h2>
            <div className="text-5xl font-bold text-indigo-600">{score}%</div>
            
            <div className="space-y-4 mt-8">
              {questions.map((question, index) => (
                <div 
                  key={question.id}
                  className={`p-4 rounded-lg ${
                    answers[question.id] === question.correct_answer
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p className="font-medium text-gray-900">Question {index + 1}: {question.question}</p>
                  <p className="text-sm mt-2">
                    Your answer: <span className={answers[question.id] === question.correct_answer ? 'text-green-600' : 'text-red-600'}>
                      {answers[question.id]}
                    </span>
                  </p>
                  {answers[question.id] !== question.correct_answer && (
                    <p className="text-sm text-green-600 mt-1">
                      Correct answer: {question.correct_answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex justify-end mt-6 gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={() => {
              setShowResults(false);
              setCurrentQuestion(0);
              setAnswers({});
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] flex flex-col">
      {renderHeader()}

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
              onClick={handleSubmit}
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

      {renderSaveDialog()}
    </div>
  );
};

export default QuizPreview; 