import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database } from "@/lib/database.types"
import { Eye } from "lucide-react"

type Template = Database['public']['Tables']['templates']['Row'] & {
  template_questions: Database['public']['Tables']['template_questions']['Row'][]
}

interface TemplateCardProps {
  template: Template
  onPreview: (template: Template) => void
  onUseTemplate: (template: Template) => void
}

export function TemplateCard({ template, onPreview, onUseTemplate }: TemplateCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{template.title}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{template.category}</Badge>
              <Badge variant="outline">{template.difficulty}</Badge>
              {template.is_premium && (
                <Badge variant="default" className="bg-gradient-to-r from-orange-400 to-rose-400">
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{template.description}</p>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {template.template_questions.length} questions
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onPreview(template)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button 
              size="sm"
              onClick={() => onUseTemplate(template)}
            >
              Use Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 