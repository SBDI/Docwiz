import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const History = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not authenticated
  if (!user) {
    navigate('/sign-in');
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Quiz History</h1>
          <p className="text-muted-foreground">
            View and manage all your generated quizzes.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Quizzes</CardTitle>
            <CardDescription>Your complete quiz history</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Quiz history list will go here */}
            <p className="text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History; 