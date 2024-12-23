import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { queries } from "@/lib/supabase/client";
import { Share2, Eye, Book, Shuffle, Download, Play, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question, QuizQuestion, DatabaseQuestion, QuestionType, UIQuestionType } from "@/types/quiz";
import QuizResults from "@/components/quiz/QuizResults";
import ExplanationView from "@/components/quiz/ExplanationView";
import ExplanationEditor from "@/components/quiz/ExplanationEditor";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// Helper function to map database question type to UI question type
const mapQuestionType = (type: QuestionType): UIQuestionType => {
  if (type === 'fill-in-blank') return 'open-ended';
  return type;
};

// Helper function to map database question to UI question
const mapDatabaseQuestion = (q: DatabaseQuestion): Question => ({
  ...q,
  type: mapQuestionType(q.type),
  options: q.options || []
});

// Helper function to map UI question to QuizQuestion (for components that need it)
const mapToQuizQuestion = (q: Question): QuizQuestion => ({
  ...q,
  options: q.options || []
});

export default function QuizView() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const quizFromState = location.state?.quiz;

  const [quiz, setQuiz] = useState<{
    id: string;
    title: string;
    description: string | null;
    questions: Question[];
  } | null>(quizFromState ? {
    ...quizFromState,
    questions: quizFromState.questions.map(mapDatabaseQuestion)
  } : null);
  const [loading, setLoading] = useState(!quizFromState);
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizId || quizFromState) return;
      
      setLoading(true);
      try {
        const data = await queries.quizzes.getQuiz(quizId);
        if (!data) {
          toast.error('Quiz not found');
          navigate('/history');
          return;
        }
        setQuiz({
          ...data,
          questions: data.questions.map(mapDatabaseQuestion)
        });
      } catch (error) {
        console.error("Failed to load quiz:", error);
        toast.error('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [quizId, quizFromState, navigate]);

  const handleAnswerSelect = (answer: string) => {
    if (quiz) {
      setSelectedAnswers(prev => ({
        ...prev,
        [quiz.questions[currentQuestionIndex].id]: answer
      }));
    }
  };

  const handleNextQuestion = () => {
    if (quiz) {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (Object.keys(selectedAnswers).length === quiz.questions.length) {
        calculateResults();
      }
    }
  };

  const calculateResults = () => {
    if (!quiz) return;

    let correctAnswers = 0;
    quiz.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / quiz.questions.length) * 100;
    setQuizScore(score);
    setShowResults(true);
  };

  const handleTryAgain = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowAnswers(false);
    setQuizScore(0);
  };

  const handleStartQuiz = () => {
    setIsTakingQuiz(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowAnswers(false);
    setShowResults(false);
    setQuizScore(0);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleShuffle = () => {
    if (!quiz) return;
    const shuffledQuestions = [...quiz.questions].sort(() => Math.random() - 0.5);
    setQuiz({
      ...quiz,
      questions: shuffledQuestions
    });
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
  };

  const handleExport = () => {
    if (!quiz) return;
    const exportData = {
      title: quiz.title,
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer
      }))
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${quiz.title.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpdateExplanation = async (questionId: string, explanation: string) => {
    try {
      await queries.questions.updateExplanation(questionId, explanation);
      // Update local state
      if (quiz) {
        setQuiz({
          ...quiz,
          questions: quiz.questions.map(q => 
            q.id === questionId ? { ...q, explanation } : q
          )
        });
      }
    } catch (error) {
      console.error('Failed to update explanation:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Quiz Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-gray-600">{quiz.description}</p>
        )}
      </div>

      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {isTakingQuiz ? (
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                  </h3>
                  <div className="text-sm text-gray-500">
                    Progress: {Math.round(progress)}%
                  </div>
                </div>
                <h3 className="text-lg font-medium">
                  {currentQuestion.question}
                </h3>
                <div className="grid gap-2">
                  {currentQuestion.options?.map((option) => (
                    <Button
                      key={option}
                      variant={selectedAnswers[currentQuestion.id] === option ? "default" : "outline"}
                      className="w-full justify-start p-4 h-auto"
                      onClick={() => handleAnswerSelect(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswers[currentQuestion.id]}
                  >
                    {isLastQuestion ? "Finish Quiz" : "Next Question"}
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            quiz?.questions.map((question, index) => {
              const quizQuestion = mapToQuizQuestion(question);
              return (
                <Card key={question.id} className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      {index + 1}. {question.question}
                    </h3>
                    <div className="grid gap-2">
                      {quizQuestion.options.map((option) => (
                        <div
                          key={option}
                          className={cn(
                            "p-4 rounded-lg border",
                            showAnswers && option === question.correct_answer
                              ? "bg-green-50 border-green-200"
                              : "bg-white"
                          )}
                        >
                          {option}
                          {showAnswers && option === question.correct_answer && (
                            <span className="ml-2 text-sm text-green-600">(Correct Answer)</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <ExplanationView
                      explanation={question.explanation}
                      isVisible={showExplanations}
                      className="mt-4"
                    />
                    <ExplanationEditor
                      questionId={question.id}
                      question={question.question}
                      correctAnswer={question.correct_answer}
                      topic={quiz.title}
                      initialExplanation={question.explanation}
                      onSave={(explanation) => handleUpdateExplanation(question.id, explanation)}
                    />
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-48 space-y-4">
          {isTakingQuiz ? (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsTakingQuiz(false)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          ) : (
            <Button
              className="w-full justify-start"
              onClick={handleStartQuiz}
            >
              <Play className="w-4 h-4 mr-2" />
              Take Quiz
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowExplanations(!showExplanations)}
          >
            <Book className="w-4 h-4 mr-2" />
            {showExplanations ? "Hide Explanations" : "Show Explanations"}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowAnswers(!showAnswers)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showAnswers ? "Hide Answer" : "Show Answer"}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {/* TODO: Implement share */}}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share & Embed
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleShuffle}
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Shuffle Answers
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quiz Results Dialog */}
      <QuizResults
        open={showResults}
        onClose={() => {
          setShowResults(false);
          setIsTakingQuiz(false);
        }}
        onTryAgain={handleTryAgain}
        questions={quiz.questions.map(mapToQuizQuestion)}
        answers={selectedAnswers}
        score={quizScore}
      />
    </div>
  );
}
