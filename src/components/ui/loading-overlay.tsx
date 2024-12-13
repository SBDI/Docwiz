import { Progress } from "./progress"

interface LoadingOverlayProps {
  progress: number
  message: string
  subMessage?: string
}

export const LoadingOverlay = ({ progress, message, subMessage }: LoadingOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/90 p-8 rounded-2xl max-w-md w-full mx-4 shadow-xl">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold text-gray-900">{message}</h3>
            {subMessage && (
              <p className="text-sm text-gray-500">{subMessage}</p>
            )}
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-500 text-center">{progress}%</p>
          </div>

          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        </div>
      </div>
    </div>
  )
} 