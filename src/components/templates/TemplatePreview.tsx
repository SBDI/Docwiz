import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database } from "@/lib/database.types"
import { useState } from "react"

type Template = Database['public']['Tables']['templates']['Row'] & {
  template_questions: Database['public']['Tables']['template_questions']['Row'][]
}

interface TemplatePreviewProps {
  template: Template | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUseTemplate: (template: Template) => void
}

export function TemplatePreview({ 
  template, 
  open, 
  onOpenChange,
  onUseTemplate 
}: TemplatePreviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  if (!template) return null

  const currentQuestion = template.template_questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === template.template_questions.length - 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{template.title}</DialogTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{template.category}</Badge>
            <Badge variant="outline">{template.difficulty}</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-2">{template.description}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Question Preview */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="mb-4">
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {template.template_questions.length}
              </span>
            </div>
            
            <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>

            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-3">
                {(currentQuestion.options as string[]).map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 rounded-lg border bg-white"
                  >
                    <span className="ml-2">{option}</span>
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.type === 'true-false' && (
              <div className="space-y-3">
                {['True', 'False'].map((option) => (
                  <div
                    key={option}
                    className="flex items-center p-3 rounded-lg border bg-white"
                  >
                    <span className="ml-2">{option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            {isLastQuestion ? (
              <Button onClick={() => onUseTemplate(template)}>
                Use Template
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex(i => Math.min(template.template_questions.length - 1, i + 1))}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 