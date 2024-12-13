import { Progress } from "./progress"

interface FileUploadProgressProps {
  progress: number
  fileName: string
}

export const FileUploadProgress = ({ progress, fileName }: FileUploadProgressProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">{fileName}</span>
          <span className="text-gray-500">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>
    </div>
  )
} 