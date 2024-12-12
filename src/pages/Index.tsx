import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NeuralBackground from "@/components/ui/neural-background";

const PricingTier = ({ name, price, features, recommended = false }) => (
  <div className={`relative bg-white/50 backdrop-blur-sm p-8 rounded-2xl border ${recommended ? 'border-indigo-500 shadow-lg' : 'border-gray-200'}`}>
    {recommended && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
        Recommended
      </div>
    )}
    <h3 className="text-xl font-semibold mb-2">{name}</h3>
    <div className="mb-6">
      <span className="text-4xl font-bold">${price}</span>
      <span className="text-gray-500">/month</span>
    </div>
    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-gray-600">
          <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <Button 
      size="lg" 
      variant={recommended ? "default" : "outline"} 
      className="w-full rounded-full"
      asChild
    >
      <Link to="/sign-up">Get Started</Link>
    </Button>
  </div>
);

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <NeuralBackground />
      
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 pt-20 pb-16 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6 px-4 py-1.5 bg-indigo-500/10 text-indigo-600 rounded-full text-sm font-medium"
          >
            ✨ Introducing Docwiz
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
          >
            Transform Documents into Smart Quizzes Instantly
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Upload any document and let AI create engaging quizzes automatically.
            Perfect for educators, trainers, and content creators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" asChild className="rounded-full">
              <Link to="/sign-up">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full">
              <Link to="/templates">View Templates</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative container mx-auto px-4 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Generate comprehensive quizzes in seconds with our advanced AI technology.</p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Analysis</h3>
            <p className="text-gray-600">Our AI understands context and generates relevant, challenging questions.</p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
            <p className="text-gray-600">Support for PDFs, docs, images, and more. Create quizzes from any content.</p>
          </div>
        </div>
      </motion.div>

      {/* Pricing Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="relative container mx-auto px-4 py-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include core features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingTier
            name="Basic"
            price={0}
            features={[
              "5 quizzes per month",
              "Basic question types",
              "PDF & Text support",
              "Email support"
            ]}
          />
          <PricingTier
            name="Pro"
            price={29}
            features={[
              "Unlimited quizzes",
              "All question types",
              "All file formats",
              "Priority support",
              "Custom branding"
            ]}
            recommended={true}
          />
          <PricingTier
            name="Enterprise"
            price={99}
            features={[
              "Everything in Pro",
              "Custom integrations",
              "Team management",
              "Advanced analytics",
              "24/7 phone support"
            ]}
          />
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </motion.div>

      {/* Social Proof */}
      <div className="relative container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <p className="text-sm font-medium text-gray-500 mb-4">TRUSTED BY EDUCATORS WORLDWIDE</p>
          <div className="flex justify-center items-center gap-8 opacity-50">
            <img src="/logos/harvard.svg" alt="University Logo" className="h-8" />
            <img src="/logos/stanford.svg" alt="University Logo" className="h-8" />
            <img src="/logos/mit.svg" alt="University Logo" className="h-8" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;