
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Search, FileText, ArrowRight, ShieldCheck, Clock, Heart } from "lucide-react";

const Index = () => {
  return (
    <div>      
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Your AI-Powered Health Assistant
              </h1>
              <p className="mt-6 text-xl text-gray-100 max-w-lg">
                MedGenius brings the power of AI to healthcare, making it more accessible, intelligent, and efficient for everyone.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <Link to="/checkup">Start Health Check</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                  <Link to="/medicine">Search Medicine</Link>
                </Button>
              </div>
              <div className="mt-8 text-sm">
                <p className="flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Your data is encrypted and secure
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600" 
                alt="AI Health Assistant" 
                className="rounded-lg shadow-xl" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Core Features</h2>
            <p className="mt-4 text-xl text-gray-500 max-w-xl mx-auto">
              Smart health tools that enable self-analysis, early diagnosis, and instant insights at your fingertips.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card bg-white">
              <Activity className="feature-icon" />
              <h3 className="text-xl font-medium text-gray-900 mb-3">Checkup Buddy</h3>
              <p className="text-gray-500 mb-6">
                A virtual assistant that simulates a primary health check-up using AI to analyze symptoms and provide insights.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link to="/checkup" className="flex items-center">
                  Try it now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="feature-card bg-white">
              <Search className="feature-icon" />
              <h3 className="text-xl font-medium text-gray-900 mb-3">MedInfo</h3>
              <p className="text-gray-500 mb-6">
                Understand any medicine with AI-powered insights, including purpose, side effects, and interactions.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link to="/medicine" className="flex items-center">
                  Search medicine <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="feature-card bg-white">
              <FileText className="feature-icon" />
              <h3 className="text-xl font-medium text-gray-900 mb-3">Report Scanner</h3>
              <p className="text-gray-500 mb-6">
                Upload medical reports and scans for AI analysis, getting plain-language explanations and insights.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link to="/reports" className="flex items-center">
                  Scan reports <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose MedGenius</h2>
            <p className="mt-4 text-xl text-gray-500 max-w-xl mx-auto">
              Empowering you with AI-driven healthcare tools that make a real difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <Clock className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Save Time</h3>
              <p className="text-gray-500">
                Get instant health insights without waiting for appointments or navigating complex health systems.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <Heart className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Better Health Decisions</h3>
              <p className="text-gray-500">
                Make informed decisions about your health with AI-powered analysis and recommendations.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-white shadow-sm">
              <ShieldCheck className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-500">
                Your health data is encrypted, secure, and never shared with third parties without your consent.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Ready to take control of your health?
                </h2>
                <p className="mt-3 text-lg text-white/90">
                  Start using MedGenius today and experience the future of healthcare.
                </p>
              </div>
              <div className="mt-8 md:mt-0 md:ml-8">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <Link to="/checkup">Try Checkup Buddy</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
