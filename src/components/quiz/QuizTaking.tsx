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
}

const QuizTaking = ({ questions, onClose, onComplete }: QuizTakingProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    Object.keys(answers).forEach((questionIndex) => {
      const idx = parseInt(questionIndex);
      if (answers[idx].toLowerCase() === questions[idx].correct_answer.toLowerCase()) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / questions.length) * 100;
    setShowResults(true);
    onComplete(score, answers);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quiz</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          
          {!showResults && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h3>
              <p className="text-base">{currentQuestion.question}</p>
              
              <div className="grid grid-cols-1 gap-2">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleAnswer(option)}
                    className="justify-start text-left"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {showResults && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-center">Quiz Complete!</h3>
              <div className="space-y-6">
                {questions.map((question, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer.toLowerCase() === question.correct_answer.toLowerCase();
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className="font-semibold">{question.question}</p>
                      <p className="text-sm mt-2">
                        Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAnswer}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm mt-1">
                          Correct answer: <span className="text-green-600">{question.correct_answer}</span>
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-sm mt-2 text-gray-600">{question.explanation}</p>
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
