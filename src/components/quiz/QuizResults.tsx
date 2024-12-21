import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { QuizQuestion } from '@/types/quiz';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from "../../lib/utils";

interface QuizResultsProps {
  open: boolean;
  onClose: () => void;
  onTryAgain: () => void;
  questions: QuizQuestion[];
  answers: Record<string, string>;
  score: number;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  open,
  onClose,
  onTryAgain,
  questions,
  answers,
  score,
}) => {
  const getAnswerStatus = (question: QuizQuestion) => {
    const isCorrect = answers[question.id] === question.correct_answer;
    return {
      isCorrect,
      statusColor: isCorrect ? 'text-green-600' : 'text-red-600',
      bgColor: isCorrect ? 'bg-green-50' : 'bg-red-50',
      Icon: isCorrect ? CheckCircle2 : XCircle,
    };
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quiz Results</DialogTitle>
          <DialogDescription>
            Here's how you performed on the quiz
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-2">
              <span className={score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}>
                {score}%
              </span>
            </div>
            <Progress 
              value={score} 
              className={cn(
                "w-full h-3 mb-2",
                score >= 70 ? "[&>div]:bg-green-600" : 
                score >= 50 ? "[&>div]:bg-yellow-600" : 
                "[&>div]:bg-red-600"
              )}
            />
            <div className="text-sm text-gray-600">
              {score >= 70 ? 'Excellent work!' : 
               score >= 50 ? 'Good effort!' : 
               'Keep practicing!'}
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const { isCorrect, statusColor, bgColor, Icon } = getAnswerStatus(question);
              
              return (
                <Card key={question.id} className={cn(`p-4 ${bgColor} border-l-4 ${
                  isCorrect ? 'border-l-green-600' : 'border-l-red-600'
                }`)}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="font-medium text-lg mb-1">
                          Question {index + 1}
                        </div>
                        <div className="text-gray-800">{question.question}</div>
                      </div>
                      <Icon className={cn(`w-6 h-6 ${statusColor} flex-shrink-0`)} />
                    </div>

                    <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                      <div className="text-sm">
                        <span className="text-gray-600">Your answer: </span>
                        <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600'}>
                          {answers[question.id]}
                        </span>
                      </div>
                      
                      {!isCorrect && (
                        <div className="text-sm">
                          <span className="text-gray-600">Correct answer: </span>
                          <span className="text-green-600 font-medium">
                            {question.correct_answer}
                          </span>
                        </div>
                      )}
                    </div>

                    {question.explanation && (
                      <div className="mt-2 text-sm text-gray-600 bg-white/50 p-3 rounded-md">
                        <span className="font-medium">Explanation: </span>
                        {question.explanation}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onTryAgain}>
            Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuizResults;
