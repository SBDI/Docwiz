import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"
import { TemplateCard } from "@/components/templates/TemplateCard"
import { TemplatePreview } from "@/components/templates/TemplatePreview"
import { queries } from "@/lib/supabase/client"
import { Database } from "@/lib/database.types"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Template = Database['public']['Tables']['templates']['Row'] & {
  template_questions: Database['public']['Tables']['template_questions']['Row'][]
}

const categories = ["All", "Programming", "Database", "Science", "Math", "Language"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

export default function Templates() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("All")
  const [difficulty, setDifficulty] = useState("All")
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

  useEffect(() => {
    async function loadTemplates() {
      try {
        const filters = {
          ...(category !== "All" && { category }),
          ...(difficulty !== "All" && { difficulty }),
        }
        const data = await queries.templates.getTemplates(filters)
        setTemplates(data)
      } catch (error) {
        console.error('Error loading templates:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTemplates()
  }, [category, difficulty])

  const handleUseTemplate = async (template: Template) => {
    try {
      if (!user) {
        navigate('/sign-in')
        return
      }

      const quiz = await queries.templates.createQuizFromTemplate(template.id, user.id)
      toast.success('Quiz created from template!')
      setPreviewTemplate(null) // Close preview if open
      navigate(`/quiz/${quiz.id}/edit`)
    } catch (error) {
      toast.error('Failed to create quiz from template')
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quiz Templates</h1>
          <p className="text-gray-500 mt-1">
            Choose from our pre-made templates to quickly create your quiz
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((diff) => (
                <SelectItem key={diff} value={diff}>
                  {diff}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[200px] rounded-lg bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard 
                key={template.id} 
                template={template}
                onPreview={setPreviewTemplate}
                onUseTemplate={handleUseTemplate}
              />
            ))}
          </div>
        )}
      </div>

      <TemplatePreview
        template={previewTemplate}
        open={!!previewTemplate}
        onOpenChange={(open) => !open && setPreviewTemplate(null)}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  )
}