import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Create or manage your quizzes.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border hover:border-gray-300 transition-colors">
          <h3 className="font-medium mb-2">Create New Quiz</h3>
          <p className="text-gray-500 text-sm mb-4">
            Generate a quiz using AI or create one manually.
          </p>
          <Button onClick={() => navigate('/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg border hover:border-gray-300 transition-colors">
          <h3 className="font-medium mb-2">Use Template</h3>
          <p className="text-gray-500 text-sm mb-4">
            Start with a pre-made template to save time.
          </p>
          <Button variant="outline" onClick={() => navigate('/templates')}>
            <FileText className="h-4 w-4 mr-2" />
            Browse Templates
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="font-medium mb-4">Recent Activity</h3>
        <div className="text-sm text-gray-500">
          View your quiz history to see recent activity.
        </div>
        <div className="mt-4">
          <Button variant="link" onClick={() => navigate('/history')} className="px-0">
            View History →
          </Button>
        </div>
      </div>
    </div>
  );
}