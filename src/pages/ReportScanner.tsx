
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReportUpload from "@/components/reports/ReportUpload";
import { ScanText, FlaskConical, FileHeart } from "lucide-react";

const ReportScanner = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold">Report Scanner</h1>
            <p className="mt-2 text-lg">Upload and analyze medical reports and images with AI</p>
          </div>
        </section>
        
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <ScanText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Document Analysis</h3>
                  <p className="text-sm text-gray-500">Extract insights from reports</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <FileHeart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Medical Imaging</h3>
                  <p className="text-sm text-gray-500">Analyze X-rays, MRIs and more</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <FlaskConical className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Lab Result Interpretation</h3>
                  <p className="text-sm text-gray-500">Understand your test results</p>
                </div>
              </div>
            </div>
            
            <ReportUpload />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportScanner;
