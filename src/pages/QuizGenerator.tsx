import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QuizGenerator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#2D3648]">AI Quiz Generator</h1>
      </div>

      {/* Description */}
      <p className="text-[#2D3648] mb-6">
        Upload a document, paste your notes, or select a video to automatically generate a quiz with AI.
      </p>

      {/* Rest of the current Dashboard.tsx content... */}
      {/* (Keep everything else the same, just moved to this component) */}
    </div>
  );
};

export default QuizGenerator; 