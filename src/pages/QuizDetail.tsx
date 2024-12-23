import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const QuizDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not authenticated
  if (!user) {
    navigate('/sign-in');
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Quiz Details</h1>
          <p className="text-muted-foreground">
            View and manage your quiz.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz #{useParams().id}</CardTitle>
            <CardDescription>Quiz details and questions</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Quiz details will go here */}
            <p className="text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizDetail;