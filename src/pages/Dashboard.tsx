import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { queries } from '@/lib/supabase/client';
import type { Database } from '@/lib/database.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShareDialog } from "@/components/quiz/ShareDialog"

type Quiz = Database['public']['Tables']['quizzes']['Row'] & {
  questions: Database['public']['Tables']['questions']['Row'][]
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [credits, setCredits] = useState(5);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<{id: string, title: string} | null>(null)

  const handleGetMoreCredits = () => {
    // First navigate to home page
    navigate('/');
    
    // Then scroll to pricing section after a short delay to ensure the page has loaded
    setTimeout(() => {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  useEffect(() => {
    async function loadQuizzes() {
      if (!user) return
      try {
        const data = await queries.quizzes.getQuizzes(user.id)
        setQuizzes(data)
      } catch (error) {
        console.error('Error loading quizzes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadQuizzes()
  }, [user])

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.email}</p>
          </div>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link to="/create">Create New Quiz</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100">Available Credits</p>
                  <h3 className="text-3xl font-bold mt-1">{credits}</h3>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="w-full mt-4 bg-white text-indigo-600 hover:bg-indigo-50"
                onClick={handleGetMoreCredits}
              >
                Get More Credits
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Quizzes</p>
                  <h3 className="text-3xl font-bold mt-1 text-gray-900">12</h3>
                </div>
                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex gap-2 text-sm">
                <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded-full">↑ 8%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Questions</p>
                  <h3 className="text-3xl font-bold mt-1 text-gray-900">164</h3>
                </div>
                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex gap-2 text-sm">
                <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded-full">↑ 12%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Quizzes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Quizzes</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/templates">Browse Templates</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : quizzes.length > 0 ? (
              <div className="divide-y">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="py-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">
                          {new Date(quiz.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {quiz.questions.length} questions
                        </span>
                        <span className={`text-sm px-2 py-0.5 rounded-full ${
                          quiz.status === 'completed' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {quiz.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/quiz/${quiz.id}/edit`}>Edit</Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedQuiz(quiz)}
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first quiz</p>
                <Button asChild>
                  <Link to="/create">Create Quiz</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedQuiz && (
        <ShareDialog
          open={!!selectedQuiz}
          onOpenChange={(open) => !open && setSelectedQuiz(null)}
          quizId={selectedQuiz.id}
          quizTitle={selectedQuiz.title}
        />
      )}
    </div>
  );
};

export default Dashboard;