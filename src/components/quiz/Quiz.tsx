import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ShareDialog } from "./ShareDialog"

interface QuizProps {
  id: string
  title: string
  questions: Question[]
  description?: string
  // Add other required props
}

export function Quiz({ id, title, ...props }: QuizProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)

  return (
    <div>
      {/* ... existing quiz content ... */}
      
      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          onClick={() => setShowShareDialog(true)}
          className="flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            aria-label="Share icon"
            role="img"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share
        </Button>
      </div>

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        quizId={id}
        quizTitle={title}
      />
    </div>
  )
} 