import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface QuizOptions {
  language: string;
  questionType: string;
  difficulty: string;
}

interface OptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (options: QuizOptions) => void;
  options: QuizOptions;
}

const OptionsDialog = ({ open, onOpenChange, onSubmit, options }: OptionsDialogProps) => {
  const [language, setLanguage] = useState(options.language);
  const [questionType, setQuestionType] = useState(options.questionType);
  const [difficulty, setDifficulty] = useState(options.difficulty);

  useEffect(() => {
    setLanguage(options.language);
    setQuestionType(options.questionType);
    setDifficulty(options.difficulty);
  }, [options]);

  const handleSubmit = () => {
    onSubmit({
      language,
      questionType,
      difficulty
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Quiz Options</DialogTitle>
          <DialogDescription>
            Customize the settings for your quiz generation
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="bg-white">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Auto Detect">Auto Detect</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="question-type">Question Type</Label>
            <Select value={questionType} onValueChange={setQuestionType}>
              <SelectTrigger id="question-type" className="bg-white">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Mix (All Types)">Mix (All Types)</SelectItem>
                <SelectItem value="Factual">Factual</SelectItem>
                <SelectItem value="Conceptual">Conceptual</SelectItem>
                <SelectItem value="Analytical">Analytical</SelectItem>
                <SelectItem value="Application">Application</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty" className="bg-white">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Auto">Auto</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSubmit}
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OptionsDialog;