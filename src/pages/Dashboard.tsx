import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Logged in as: {user.email}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;