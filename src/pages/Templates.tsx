import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  questionsCount: number;
}

const sampleTemplates: Template[] = [
  {
    id: "1",
    title: "Basic Programming Concepts",
    description: "Core programming fundamentals including variables, loops, and functions",
    category: "Programming",
    questionsCount: 20
  },
  {
    id: "2",
    title: "World History Overview",
    description: "Major historical events and periods from ancient to modern times",
    category: "History",
    questionsCount: 25
  },
  {
    id: "3",
    title: "Business Management Essentials",
    description: "Key concepts in business management and leadership",
    category: "Business",
    questionsCount: 15
  },
  {
    id: "4",
    title: "Scientific Method",
    description: "Understanding the scientific process and methodology",
    category: "Science",
    questionsCount: 18
  },
  {
    id: "5",
    title: "Language Learning Basics",
    description: "Fundamental concepts for learning a new language",
    category: "Languages",
    questionsCount: 22
  }
];

const Templates = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-[#2D3648]">Quiz Templates</h1>
            <p className="text-[#64748B] mt-1">
              Start with a pre-made template or customize it to your needs
            </p>
          </div>
          <Button asChild>
            <Link to="/create">Create Custom Quiz</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <span className="inline-block mt-1 text-xs font-medium text-white bg-indigo-500 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
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
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                  <Button size="sm">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates; 