import { Quiz } from '@/types/quiz';
import { format } from 'date-fns';
import { 
  FileText, 
  BookOpen, 
  Link as LinkIcon,
  Calendar,
  ChevronRight 
} from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
  onView: (id: number) => void;
  isNavigating: boolean;
}

export const QuizCard = ({ quiz, onView, isNavigating }: QuizCardProps) => {
  return (
    <div className="flex flex-col gap-2">
      {/* ... existing quiz card content ... */}
    </div>
  );
}; 