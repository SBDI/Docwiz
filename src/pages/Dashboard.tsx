import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock data for recent quizzes
const mockRecentQuizzes = [
  { id: 1, name: "Biology Quiz", source: "Text Input", date: "2024-01-12" },
  { id: 2, name: "History Test", source: "Document", date: "2024-01-11" },
  { id: 3, name: "Physics Quiz", source: "Web Link", date: "2024-01-10" },
];

// Mock subscription data (replace with actual data later)
const mockSubscription = {
  type: "Free Plan",
  credits: 100,
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Welcome to your Dashboard</CardTitle>
            <p className="text-gray-600 mt-1">Logged in as: {user.email}</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </CardHeader>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Actions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" asChild>
              <Link to="/generate">Generate New Quiz</Link>
            </Button>
            <Button className="w-full" variant="secondary" asChild>
              <Link to="/history">View Quiz History</Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/credits">Manage Credits</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {mockRecentQuizzes.length > 0 ? (
              <div className="space-y-4">
                {mockRecentQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{quiz.name}</h4>
                      <p className="text-sm text-gray-600">
                        Source: {quiz.source}
                      </p>
                      <p className="text-sm text-gray-600">Date: {quiz.date}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/quiz/${quiz.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No recent quizzes</p>
            )}
          </CardContent>
        </Card>

        {/* Subscription Status Section */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription & Credits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="font-medium">Current Plan</p>
              <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                <span>{mockSubscription.type}</span>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/credits">Upgrade</Link>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium">Credit Balance</p>
              <div className="bg-muted p-3 rounded-lg">
                <span className="text-xl font-bold">{mockSubscription.credits}</span>
                <span className="text-gray-600 ml-2">credits remaining</span>
              </div>
            </div>

            {mockSubscription.type === "Free Plan" && (
              <Alert>
                <AlertDescription>
                  Upgrade your plan to get more credits and unlock premium features!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;