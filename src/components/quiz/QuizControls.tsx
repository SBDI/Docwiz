import { useState } from "react";
import { Button } from "../ui/button";
import { 
  Play, 
  Eye, 
  EyeOff, 
  BookOpen, 
  BookX,
  Share2,
  Shuffle,
  Download
} from "lucide-react";

interface QuizControlsProps {
  onTakeQuiz: () => void;
  onShare: () => void;
  onShuffle?: () => void;
  onExport?: () => void;
  showExplanations: boolean;
  showAnswers: boolean;
  onToggleExplanations: () => void;
  onToggleAnswers: () => void;
}

export function QuizControls({
  onTakeQuiz,
  onShare,
  onShuffle,
  onExport,
  showExplanations,
  showAnswers,
  onToggleExplanations,
  onToggleAnswers,
}: QuizControlsProps) {
  return (
    <div className="flex flex-col gap-2 w-56">
      <Button 
        onClick={onTakeQuiz}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
      >
        <Play className="w-4 h-4 mr-2" />
        Take Quiz
      </Button>

      <Button
        variant="outline"
        onClick={onToggleExplanations}
        className={`w-full justify-start ${showExplanations ? 'bg-gray-100' : ''}`}
      >
        {showExplanations ? (
          <>
            <BookX className="w-4 h-4 mr-2" />
            Hide Explanations
          </>
        ) : (
          <>
            <BookOpen className="w-4 h-4 mr-2" />
            Show Explanations
          </>
        )}
      </Button>

      <Button
        variant="outline"
        onClick={onToggleAnswers}
        className={`w-full justify-start ${showAnswers ? 'bg-gray-100' : ''}`}
      >
        {showAnswers ? (
          <>
            <EyeOff className="w-4 h-4 mr-2" />
            Hide Answers
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 mr-2" />
            Show Answers
          </>
        )}
      </Button>

      <Button
        variant="outline"
        onClick={onShare}
        className="w-full justify-start"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share & Embed
      </Button>

      {onShuffle && (
        <Button
          variant="outline"
          onClick={onShuffle}
          className="w-full justify-start"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Shuffle Answers
        </Button>
      )}

      {onExport && (
        <Button
          variant="outline"
          onClick={onExport}
          className="w-full justify-start"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      )}
    </div>
  );
}
