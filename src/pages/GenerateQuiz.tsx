import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TestGroqApi } from '@/components/TestGroqApi';

const GenerateQuiz = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Your quiz generation logic here
    try {
      // ... generation code
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-6"
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Generate Quiz</h1>
        
        <div>
          <TestGroqApi />
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? "Generating..." : "Generate Quiz"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default GenerateQuiz;