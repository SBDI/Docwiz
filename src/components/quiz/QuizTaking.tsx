import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Progress } from "../ui/progress";
import { useToast } from "../ui/use-toast";
import type { QuizQuestion } from "../../types/quiz";

interface QuizTakingProps {
  questions: QuizQuestion[];
  onClose: () => void;
  onComplete: (score: number, answers: Record<string, string>) => void;
  showExplanations?: boolean;
  showAnswers?: boolean;
}

const QuizTaking = ({ 
  questions, 
  onClose, 
  onComplete,
  showExplanations = false,
  showAnswers = false,
}: QuizTakingProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer,
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (answers[question.id]?.toLowerCase() === question.correct_answer.toLowerCase()) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / questions.length) * 100;
    setShowResults(true);
    onComplete(score, answers);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Safety check for empty questions array
  if (!questions || questions.length === 0) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quiz</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p>No questions available. Please try again.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quiz</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          
          {!showResults && currentQuestion && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h3>
              <p className="text-base">{currentQuestion.question}</p>
              
              <div className="grid grid-cols-1 gap-2">
                {currentQuestion.options?.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleAnswer(option)}
                    className={`justify-start text-left ${
                      showAnswers && option === currentQuestion.correct_answer
                        ? 'bg-green-100 hover:bg-green-200'
                        : ''
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {(showAnswers || showExplanations) && (
                <div>
                  {showAnswers && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <p className="font-medium text-green-800">
                        Correct Answer: {currentQuestion.correct_answer}
                      </p>
                    </div>
                  )}

                  {showExplanations && currentQuestion.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-800">Explanation:</p>
                      <p className="mt-1 text-blue-700">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {showResults && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-center">Quiz Complete!</h3>
              <div className="space-y-6">
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer?.toLowerCase() === question.correct_answer.toLowerCase();
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border ${
                      showAnswers ? (isCorrect ? 'bg-green-50' : 'bg-red-50') : ''
                    }`}>
                      <p className="font-semibold">{question.question}</p>
                      
                      {showAnswers && (
                        <div className="mt-2 space-y-1">
                          <p className="text-sm">
                            Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAnswer}</span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm">
                              Correct answer: <span className="text-green-600">{question.correct_answer}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {showExplanations && question.explanation && (
                        <div className="mt-2 p-2 bg-blue-50 rounded">
                          <p className="text-sm text-blue-700">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizTaking;
