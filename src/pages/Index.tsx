import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NeuralBackground from "@/components/ui/neural-background";
import { LandingNav } from "@/components/layout/LandingNav";
import { useEffect } from "react";

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

const HowItWorks = () => (
  <div className="py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create engaging quizzes in just two simple steps
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Step 1 */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
          <div className="mb-6">
            <span className="inline-block text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-full px-3 py-1">
              Step 1: Upload
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Upload Your Content
          </h3>
          <p className="text-gray-600 mb-6">
            Upload a picture, paste text, or add a document to easily convert your study materials into a quiz.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
              <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documents
            </span>
            <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
              <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Images
            </span>
            <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
              <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Text
            </span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
          <div className="mb-6">
            <span className="inline-block text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-full px-3 py-1">
              Step 2: Generate
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Generate & Customize
          </h3>
          <p className="text-gray-600 mb-6">
            Our AI analyzes your content and generates relevant questions. Edit, customize, and share your quiz.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
              <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </span>
            <span className="inline-flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
              <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </span>
          </div>
        </div>
      </div>

      {/* Language Support Banner */}
      <div className="mt-16 text-center">
        <p className="text-gray-600">
          Works in over 50 languages including Arabic
        </p>
      </div>
    </div>
  </div>
);

const Index = () => {
  useEffect(() => {
    if (window.location.hash === '#pricing') {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        setTimeout(() => {
          pricingSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen">
      <LandingNav />
      <NeuralBackground />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            From document to Quiz
            <br />
            <span className="text-indigo-600">in Seconds 📋</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Transform your documents and topics into interactive quizzes instantly.
            Perfect for teachers, trainers, and content creators.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button size="lg" className="rounded-full" asChild>
              <Link to="/sign-up">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full" asChild>
              <Link to="/templates">View Templates</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <HowItWorks />

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
        id="pricing"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="relative container mx-auto px-4 py-16 scroll-mt-20"
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