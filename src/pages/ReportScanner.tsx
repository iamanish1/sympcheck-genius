
import { useState } from "react";
import ReportUpload from "@/components/reports/ReportUpload";
import { ScanText, FlaskConical, FileHeart, Brain, Shield, HeartPulse } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ReportScanner = () => {
  const [activeTab, setActiveTab] = useState("upload");
  
  return (
    <div>
      <section className="bg-primary text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Medical Report Interpreter</h1>
            <p className="mt-2 text-lg md:text-xl">
              Get clear, accurate explanations of your medical reports with our AI assistant. 
              Like having a friendly health expert by your side.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button variant="secondary" className="gap-2">
                <Shield className="h-4 w-4" /> Privacy Protected
              </Button>
              <Button variant="secondary" className="gap-2">
                <Brain className="h-4 w-4" /> 98%+ Accuracy
              </Button>
              <Button variant="secondary" className="gap-2">
                <HeartPulse className="h-4 w-4" /> Caring Support
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="upload" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-2 max-w-md w-full">
                <TabsTrigger value="upload">Upload Report</TabsTrigger>
                <TabsTrigger value="learn">How It Works</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="upload" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="bg-white shadow-sm transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                      <ScanText className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Document Analysis</CardTitle>
                    <CardDescription>
                      Upload and understand your lab reports, blood work, and other medical documents
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="bg-white shadow-sm transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                      <FileHeart className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Medical Imaging</CardTitle>
                    <CardDescription>
                      Get insights on X-rays, MRIs, CT scans, and other medical imaging results
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="bg-white shadow-sm transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                      <FlaskConical className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Lab Result Interpretation</CardTitle>
                    <CardDescription>
                      Understand your test results with clear explanations in simple language
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
              
              <ReportUpload />
            </TabsContent>
            
            <TabsContent value="learn">
              <Card>
                <CardHeader>
                  <CardTitle>How Our Report Scanner Works</CardTitle>
                  <CardDescription>
                    Understanding the technology behind our medical report analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-gray-50">
                      <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <ScanText className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">1. Upload Your Report</h3>
                      <p className="text-gray-600">
                        Securely upload your lab reports, medical images, or other health documents through our encrypted system.
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-gray-50">
                      <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <Brain className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">2. AI Analysis</h3>
                      <p className="text-gray-600">
                        Our advanced AI analyzes your documents using medical knowledge from millions of clinical records and research papers.
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-gray-50">
                      <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <HeartPulse className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">3. Get Insights</h3>
                      <p className="text-gray-600">
                        Receive easy-to-understand insights about your health, with important findings highlighted and explained.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-700 mb-2">Your Privacy & Security</h4>
                    <p className="text-sm text-blue-700">
                      We take your privacy seriously. Your medical data is encrypted, processed securely, and never stored 
                      after analysis unless you choose to save it. Our system is compliant with healthcare data protection standards.
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-700 mb-2">Important Medical Disclaimer</h4>
                    <p className="text-sm text-amber-700">
                      While our AI provides highly accurate insights (98%+ accuracy), it's designed to support—not replace—professional 
                      medical advice. Always consult with healthcare professionals for diagnosis, treatment decisions, or if you have 
                      concerns about your health.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium mb-3">Ready to understand your medical reports?</h3>
            <Button 
              size="lg" 
              onClick={() => setActiveTab("upload")} 
              className="gap-2"
            >
              <ScanText className="h-4 w-4" /> Upload Your Report Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReportScanner;
