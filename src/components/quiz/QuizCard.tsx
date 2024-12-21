import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "./ShareDialog";
import QuizPreview from "./QuizPreview";
import { useToast } from "@/components/ui/use-toast";
import type { QuizQuestion } from '@/types/quiz';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Play, Eye, Share2, Edit, Download } from 'lucide-react';

interface QuizCardProps {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  onEdit?: () => void;
  onTakeQuiz?: () => void;
}

const QuizCard = ({ id, title, description, questions, onEdit, onTakeQuiz }: QuizCardProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      const quizData = {
        title,
        description,
        questions,
      };

      const blob = new Blob([JSON.stringify(quizData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-quiz.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Quiz Exported",
        description: "Quiz has been exported successfully!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-1">{description}</CardDescription>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowPreview(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">
            {questions.length} questions
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={onTakeQuiz}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Take Quiz
          </Button>
        </CardFooter>
      </Card>

      {showPreview && (
        <QuizPreview
          questions={questions}
          onClose={() => setShowPreview(false)}
        />
      )}

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        quizId={id}
        quizTitle={title}
      />
    </>
  );
};

export default QuizCard;
