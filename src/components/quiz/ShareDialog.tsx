import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quizId: string
  quizTitle: string
}

export function ShareDialog({ open, onOpenChange, quizId, quizTitle }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const shareUrl = `${window.location.origin}/quiz/${quizId}`

  const handleCopyLink = async () => {
    setIsLoading(true)
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        title: "Link copied",
        description: "Quiz link has been copied to clipboard",
        variant: "success",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    setIsLoading(true)
    if (navigator.share) {
      try {
        await navigator.share({
          title: quizTitle,
          text: `Take this quiz: ${quizTitle}`,
          url: shareUrl,
        })
        toast({
          title: "Shared successfully",
          variant: "success",
        })
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: "Failed to share",
            description: "Please try again",
            variant: "destructive",
          })
        }
      } finally {
        setIsLoading(false)
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Quiz</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1"
              aria-label="Quiz share URL"
            />
            <Button 
              variant="outline" 
              onClick={handleCopyLink}
              className="shrink-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Copying...
                </span>
              ) : copied ? (
                <span className="text-green-600">Copied!</span>
              ) : (
                "Copy Link"
              )}
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              className="flex-1" 
              onClick={handleShare}
            >
              Share Quiz
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              asChild
            >
              <a
                href={`mailto:?subject=${encodeURIComponent(quizTitle)}&body=${encodeURIComponent(`Take this quiz: ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Share via Email
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 