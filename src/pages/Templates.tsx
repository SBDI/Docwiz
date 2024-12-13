import { useState } from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuizPreview from "@/components/quiz/QuizPreview";
import { Badge } from "@/components/ui/badge";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionsCount: number;
  questions: {
    id: string;
    type: 'multiple-choice' | 'true-false' | 'open-ended';
    question: string;
    options?: string[];
    correctAnswer: string | number;
  }[];
}

const sampleTemplates: Template[] = [
  {
    id: "1",
    title: "Basic Programming Concepts",
    description: "Core programming fundamentals including variables, loops, and functions",
    category: "Programming",
    tags: ["JavaScript", "Basics", "Computer Science"],
    difficulty: "Beginner",
    questionsCount: 20,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What is a variable?",
        options: [
          "A container for storing data values",
          "A loop statement",
          "A function name",
          "A programming language"
        ],
        correctAnswer: "A container for storing data values"
      },
      {
        id: "q2",
        type: "true-false",
        question: "JavaScript is a statically typed language",
        correctAnswer: "false"
      },
      // Add more questions...
    ]
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    description: "Deep dive into advanced JavaScript concepts",
    category: "Programming",
    tags: ["JavaScript", "Advanced", "Web Development"],
    difficulty: "Advanced",
    questionsCount: 25,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What is a variable?",
        options: [
          "A container for storing data values",
          "A loop statement",
          "A function name",
          "A programming language"
        ],
        correctAnswer: "A container for storing data values"
      },
      {
        id: "q2",
        type: "true-false",
        question: "JavaScript is a statically typed language",
        correctAnswer: "false"
      },
      // Add more questions...
    ]
  },
  // Add more templates...
];

const categories = ["All", "Programming", "Science", "Math", "Language", "History"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

const Templates = () => {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from templates
  const allTags = Array.from(
    new Set(sampleTemplates.flatMap(template => template.tags))
  ).sort();

  const filteredTemplates = sampleTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || template.difficulty === selectedDifficulty;
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => template.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesDifficulty && matchesTags;
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-8">
        {previewTemplate ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{previewTemplate.title}</h2>
                <p className="text-gray-500 mt-1">{previewTemplate.description}</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => setPreviewTemplate(null)}
              >
                Back to Templates
              </Button>
            </div>
            <QuizPreview 
              questions={previewTemplate.questions}
              onClose={() => setPreviewTemplate(null)}
            />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quiz Templates</h1>
                <p className="text-gray-500 mt-1">
                  Start with a pre-made template or customize it to your needs
                </p>
              </div>
              <Button asChild>
                <Link to="/create">Create Custom Quiz</Link>
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
              
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Difficulty</label>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map(difficulty => (
                      <Button
                        key={difficulty}
                        variant={selectedDifficulty === difficulty ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDifficulty(difficulty)}
                      >
                        {difficulty}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedTags(prev =>
                            prev.includes(tag)
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          )
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{template.category}</Badge>
                          <Badge variant="outline">{template.difficulty}</Badge>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {template.questionsCount} questions
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        Preview
                      </Button>
                      <Button size="sm" asChild>
                        <Link to={`/create?template=${template.id}`}>
                          Use Template
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Templates; 