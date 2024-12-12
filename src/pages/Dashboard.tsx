import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface QuizHistory {
  id: string;
  createdAt: string;
  title: string;
  questionsCount: number;
  status: 'completed' | 'failed';
}

const Dashboard = () => {
  const { user } = useAuth();
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (user) {
      fetchQuizHistory();
      fetchCredits();
    }
  }, [user]);

  const fetchQuizHistory = async () => {
    const { data, error } = await supabase
      .from('quiz_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quiz history:', error);
      return;
    }

    setQuizHistory(data);
  };

  const fetchCredits = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching credits:', error);
      return;
    }

    setCredits(data.credits);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credits Card */}
        <Card>
          <CardHeader>
            <CardTitle>Available Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{credits}</div>
            <p className="text-sm text-gray-500 mt-1">Credits remaining</p>
            <Button className="w-full mt-4" asChild>
              <Link to="/credits">Get More Credits</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" asChild>
              <Link to="/create">Create New Quiz</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/history">View All Quizzes</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">{quizHistory.length}</div>
                <div className="text-sm text-gray-500">Total Quizzes</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {quizHistory.filter(q => q.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quizzes */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Quizzes</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/history">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quizHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No quizzes yet. Create your first quiz!</p>
                <Button className="mt-4" asChild>
                  <Link to="/create">Create Quiz</Link>
                </Button>
              </div>
            ) : (
              quizHistory.slice(0, 5).map((quiz) => (
                <div 
                  key={quiz.id} 
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h4 className="font-medium">{quiz.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {quiz.questionsCount} questions
                    </span>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/quiz/${quiz.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Banner */}
      <Card className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold">Upgrade to Pro</h3>
              <p className="text-indigo-100">Get unlimited quizzes and advanced features</p>
            </div>
            <Button 
              variant="secondary" 
              className="bg-white text-indigo-600 hover:bg-indigo-50"
              asChild
            >
              <Link to="/pricing">View Plans</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;