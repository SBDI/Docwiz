import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import QuizPreview from "@/components/quiz/QuizPreview";

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  question: string;
  options?: string[];
  correctAnswer: string | number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

const QuizEditor = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz>({
    id: quizId || '',
    title: 'Untitled Quiz',
    description: '',
    questions: []
  });
  const [activeQuestion, setActiveQuestion] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleQuestionUpdate = (field: string, value: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, idx) => 
        idx === activeQuestion 
          ? { ...q, [field]: value }
          : q
      )
    }));
  };

  const handleOptionUpdate = (optionIndex: number, value: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, idx) => 
        idx === activeQuestion 
          ? {
              ...q,
              options: q.options?.map((opt, i) => 
                i === optionIndex ? value : opt
              )
            }
          : q
      )
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(quiz, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${quiz.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Input
            value={quiz.title}
            onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
            className="text-2xl font-bold border-none px-0 text-gray-900 focus-visible:ring-0"
          />
          <Input
            value={quiz.description}
            onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
            className="text-gray-500 border-none px-0 focus-visible:ring-0"
            placeholder="Add a description"
          />
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsPreviewMode(true)}
          >
            Preview
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExport}
          >
            Export
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {isPreviewMode ? (
        <QuizPreview 
          questions={quiz.questions}
          onClose={() => setIsPreviewMode(false)}
        />
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {/* Questions List Sidebar */}
          <div className="col-span-1 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Questions</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setQuiz(prev => ({
                    ...prev,
                    questions: [...prev.questions, {
                      id: Math.random().toString(36).substr(2, 9),
                      type: 'multiple-choice',
                      question: 'New Question',
                      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                      correctAnswer: 0
                    }]
                  }));
                }}
              >
                Add Question
              </Button>
            </div>
            
            <div className="space-y-2">
              {quiz.questions.map((question, idx) => (
                <Card
                  key={question.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 ${
                    idx === activeQuestion ? 'border-indigo-500 bg-indigo-50' : ''
                  }`}
                  onClick={() => setActiveQuestion(idx)}
                >
                  <p className="text-sm truncate">{question.question}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {question.type.replace('-', ' ')}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Question Editor */}
          <div className="col-span-3">
            {quiz.questions[activeQuestion] && (
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <Textarea
                      value={quiz.questions[activeQuestion].question}
                      onChange={(e) => handleQuestionUpdate('question', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {quiz.questions[activeQuestion].type === 'multiple-choice' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options
                      </label>
                      <div className="space-y-3">
                        {quiz.questions[activeQuestion].options?.map((option, idx) => (
                          <div key={idx} className="flex gap-3">
                            <Input
                              value={option}
                              onChange={(e) => handleOptionUpdate(idx, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setQuiz(prev => ({
                                  ...prev,
                                  questions: prev.questions.map((q, qIdx) => 
                                    qIdx === activeQuestion 
                                      ? {
                                          ...q,
                                          options: q.options?.filter((_, i) => i !== idx)
                                        }
                                      : q
                                  )
                                }));
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setQuiz(prev => ({
                              ...prev,
                              questions: prev.questions.map((q, idx) => 
                                idx === activeQuestion 
                                  ? {
                                      ...q,
                                      options: [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`]
                                    }
                                  : q
                              )
                            }));
                          }}
                        >
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <Input
                      value={quiz.questions[activeQuestion].correctAnswer}
                      onChange={(e) => handleQuestionUpdate('correctAnswer', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizEditor; 