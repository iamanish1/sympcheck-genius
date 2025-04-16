
import SymptomChecker from "@/components/checkup/SymptomChecker";
import { Stethoscope, Shield, Clipboard } from "lucide-react";

const CheckupBuddy = () => {
  return (
    <div>
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold">Checkup Buddy</h1>
          <p className="mt-2 text-lg">Your AI-powered health assessment tool</p>
        </div>
      </section>
      
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Smart Analysis</h3>
                <p className="text-sm text-gray-500">AI-powered symptom assessment</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Private & Secure</h3>
                <p className="text-sm text-gray-500">Your health data is protected</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <Clipboard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Personalized Insights</h3>
                <p className="text-sm text-gray-500">Tailored to your health profile</p>
              </div>
            </div>
          </div>
          
          <SymptomChecker />
        </div>
      </section>
    </div>
  );
};

export default CheckupBuddy;
