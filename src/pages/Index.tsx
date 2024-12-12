import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import NeuralBackground from "@/components/NeuralBackground";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <>
      <NeuralBackground />
      <div className="min-h-screen flex flex-col items-center relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl px-6 mt-20"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
          >
            Introducing DocWiz
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Transform Documents into Smart Quizzes Instantly
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-300 mb-12"
          >
            Upload any document and let AI create engaging quizzes automatically.
            Perfect for educators, trainers, and content creators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-x-4"
          >
            <Button
              onClick={() => navigate("/sign-up")}
              className="button-primary text-lg px-8 py-4"
            >
              Start Converting <ArrowRight className="ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/sign-in")}
              variant="outline"
              className="text-lg px-8 py-4 border-primary text-primary hover:bg-primary/10"
            >
              Sign In
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-5xl"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.2 }}
              className="glass-card p-6 rounded-xl hover-lift"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-100">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-32 px-6 max-w-5xl w-full"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-100">How DocWiz Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-100">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-32 px-6 max-w-5xl w-full"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-100">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
            {pricingPlans.map((plan) => (
              <div key={plan.title} className="glass-card p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4 text-gray-100">{plan.title}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">${plan.price}</span>
                  <span className="text-gray-300">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => navigate("/sign-up")}
                  className={plan.recommended ? "w-full button-primary" : "w-full"}
                  variant={plan.recommended ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-32 mb-8 text-center text-gray-400"
        >
          <p>© 2024 DocWiz. All rights reserved.</p>
        </motion.footer>
      </div>
    </>
  );
};

const features = [
  {
    title: "Smart Document Analysis",
    description: "Upload PDFs, docs, or paste text. Our AI extracts key concepts automatically.",
    icon: <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  },
  {
    title: "AI Question Generation",
    description: "Advanced algorithms create diverse question types: multiple choice, true/false, and more.",
    icon: <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  },
  {
    title: "Instant Quiz Export",
    description: "Download quizzes in multiple formats or share them directly with your team.",
    icon: <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  }
];

const steps = [
  {
    title: "Upload Document",
    description: "Upload any document format or paste your text directly into DocWiz."
  },
  {
    title: "AI Processing",
    description: "Our AI analyzes the content and identifies key concepts and learning points."
  },
  {
    title: "Get Your Quiz",
    description: "Receive a professionally formatted quiz ready to use or customize."
  }
];

const pricingPlans = [
  {
    title: "Free",
    price: "0",
    features: [
      "5 quizzes per month",
      "Basic question types",
      "PDF export",
      "Email support"
    ]
  },
  {
    title: "Pro",
    price: "29",
    recommended: true,
    features: [
      "Unlimited quizzes",
      "Advanced question types",
      "All export formats",
      "Priority support",
      "Custom branding",
      "Analytics dashboard"
    ]
  }
];

export default Index;