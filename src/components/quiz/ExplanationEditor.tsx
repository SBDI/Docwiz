import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";

interface ExplanationEditorProps {
  questionId: string;
  initialExplanation: string | null;
  onSave: (explanation: string) => Promise<void>;
}

export default function ExplanationEditor({
  questionId,
  initialExplanation,
  onSave,
}: ExplanationEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [explanation, setExplanation] = useState(initialExplanation || "");

  const handleSave = async () => {
    try {
      await onSave(explanation);
      setIsEditing(false);
      toast.success("Explanation saved successfully");
    } catch (error) {
      toast.error("Failed to save explanation");
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Explanation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Textarea
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        placeholder="Enter explanation..."
        className="min-h-[100px]"
      />
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsEditing(false);
            setExplanation(initialExplanation || "");
          }}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
