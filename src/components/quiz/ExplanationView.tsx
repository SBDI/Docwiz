import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExplanationViewProps {
  explanation: string | null;
  isVisible: boolean;
  onToggle?: () => void;
  className?: string;
}

export default function ExplanationView({ 
  explanation, 
  isVisible, 
  onToggle,
  className 
}: ExplanationViewProps) {
  if (!explanation) return null;
  
  return (
    <div className={cn("space-y-2", className)}>
      {onToggle && (
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="w-full justify-start"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          {isVisible ? "Hide Explanation" : "Show Explanation"}
        </Button>
      )}
      
      {isVisible && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Explanation</h4>
          <p className="text-sm text-blue-800 whitespace-pre-wrap">{explanation}</p>
        </Card>
      )}
    </div>
  );
}
