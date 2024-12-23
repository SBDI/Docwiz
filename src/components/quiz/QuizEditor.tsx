import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import type { Question } from "@/types/quiz";

interface QuizEditorProps {
  title: string;
  questions: Question[];
  onSave: (title: string, questions: Question[]) => void;
}

export const QuizEditor = ({ title: initialTitle, questions: initialQuestions, onSave }: QuizEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [questions, setQuestions] = useState(initialQuestions);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    const options = [...(updatedQuestions[questionIndex].options || [])];
    options[optionIndex] = value;
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
    };
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const options = [...(updatedQuestions[questionIndex].options || []), ""];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
    };
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    const options = [...(updatedQuestions[questionIndex].options || [])];
    options.splice(optionIndex, 1);
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
    };
    setQuestions(updatedQuestions);
  };

  const handleSave = () => {
    onSave(title, questions);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold w-full"
          placeholder="Quiz Title"
        />
        <Button onClick={handleSave} className="ml-4">
          Save Quiz
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((question, questionIndex) => (
          <Card key={questionIndex} className="p-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">Question {questionIndex + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingIndex(editingIndex === questionIndex ? null : questionIndex)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  {editingIndex === questionIndex ? (
                    <Textarea
                      value={question.question}
                      onChange={(e) => handleQuestionChange(questionIndex, "question", e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-2">{question.question}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Options</span>
                  {editingIndex === questionIndex && (
                    <Button variant="ghost" size="sm" onClick={() => addOption(questionIndex)}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </div>
                {(question.options || []).map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <div className="flex-1">
                      {editingIndex === questionIndex ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(questionIndex, optionIndex)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className={`p-2 rounded ${option === question.correct_answer ? 'bg-green-100' : ''}`}>
                          {option}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {editingIndex === questionIndex && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Correct Answer</label>
                  <select
                    value={question.correct_answer}
                    onChange={(e) => handleQuestionChange(questionIndex, "correct_answer", e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {(question.options || []).map((option, optionIndex) => (
                      <option key={optionIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Explanation</label>
                {editingIndex === questionIndex ? (
                  <Textarea
                    value={question.explanation || ''}
                    onChange={(e) => handleQuestionChange(questionIndex, "explanation", e.target.value)}
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{question.explanation}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuizEditor;
