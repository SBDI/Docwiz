import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ShareDialog } from "./ShareDialog"
import { QuizEditor } from "./QuizEditor"
import QuizTaking from "./QuizTaking"
import { QuizControls } from "./QuizControls"
import type { Question, QuizQuestion } from "@/types/quiz"

interface QuizProps {
  id: string
  title: string
  questions: Question[]
  description?: string
  onSave?: (title: string, questions: Question[]) => void
  isEditable?: boolean
}

export function Quiz({ id, title, questions: initialQuestions, description, onSave, isEditable = true }: QuizProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions);
  const [quizTitle, setQuizTitle] = useState(title);
  const [showExplanations, setShowExplanations] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleSave = (newTitle: string, updatedQuestions: Question[]) => {
    setQuizTitle(newTitle);
    setQuestions(updatedQuestions);
    onSave?.(newTitle, updatedQuestions);
  };

  const handlePreviewToggle = () => {
    setIsPreview(!isPreview);
    // Reset visibility states when toggling preview
    setShowAnswers(false);
    setShowExplanations(false);
  };

  const handleQuizComplete = (score: number, answers: Record<string, string>) => {
    setIsPreview(false);
  };

  const handleShuffle = () => {
    const shuffledQuestions = [...questions].map(q => ({
      ...q,
      options: q.options ? [...q.options].sort(() => Math.random() - 0.5) : null
    }));
    setQuestions(shuffledQuestions);
  };

  // Convert Question[] to QuizQuestion[] for QuizTaking component
  const quizQuestions: QuizQuestion[] = questions.map(q => ({
    ...q,
    type: q.type === 'fill-in-blank' ? 'open-ended' : q.type,
    options: q.options || []
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{quizTitle}</h1>
          {description && (
            <p className="text-gray-600 mb-4">{description}</p>
          )}

          {isPreview ? (
            <QuizTaking
              questions={quizQuestions}
              onClose={() => setIsPreview(false)}
              onComplete={handleQuizComplete}
              showExplanations={false}
              showAnswers={false}
            />
          ) : (
            isEditable && (
              <QuizEditor
                title={quizTitle}
                questions={questions}
                onSave={handleSave}
              />
            )
          )}
        </div>

        <div className="flex-none">
          <QuizControls
            onTakeQuiz={handlePreviewToggle}
            onShare={() => setShowShareDialog(true)}
            onShuffle={handleShuffle}
            showExplanations={false}
            showAnswers={false}
            onToggleExplanations={() => setShowExplanations(!showExplanations)}
            onToggleAnswers={() => setShowAnswers(!showAnswers)}
          />
        </div>
      </div>

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        quizId={id}
        quizTitle={quizTitle}
      />
    </div>
  );
}