
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image as ImageIcon, Upload, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { uploadReport, getReportAnalysis } from "../../api/reportService";
import ReportAnalysisResult from "./ReportAnalysisResult";

const ReportUpload = () => {
  const [activeTab, setActiveTab] = useState("image");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      if (!selectedFile.type.includes("image/") && !selectedFile.type.includes("application/pdf")) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image or PDF file"
        });
        return;
      }
      
      setFile(selectedFile);
      setUploadComplete(false);
      
      // Create preview if it's an image
      if (selectedFile.type.includes("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // For PDF, just show a generic preview
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: `Please upload a ${activeTab === "image" ? "medical image" : "medical report"}`
      });
      return;
    }
    
    try {
      setIsUploading(true);
      const result = await uploadReport(file);
      setReportId(result.report.id);
      
      setIsUploading(false);
      setIsAnalyzing(true);
      
      // Begin polling for results
      startPollingForResults(result.report.id);
      
    } catch (error: any) {
      setIsUploading(false);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload the report"
      });
    }
  };

  const startPollingForResults = (id: string) => {
    // Clear any existing interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    // Set up polling
    const interval = setInterval(async () => {
      try {
        const result = await getReportAnalysis(id);
        
        if (result.report.status === 'completed') {
          clearInterval(interval);
          setIsAnalyzing(false);
          setUploadComplete(true);
          setAnalysisResult(result.report.analysisResults);
          
          toast({
            title: "Analysis Complete",
            description: "Your medical report has been processed successfully",
          });
        } else if (result.report.status === 'failed') {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisError("Analysis failed. Please try again or contact support.");
          
          toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: "We couldn't process your report. Please try again."
          });
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 2000);
    
    setPollingInterval(interval);
  };

  const viewAnalysisResults = () => {
    setIsDialogOpen(true);
  };

  const resetUpload = () => {
    setFile(null);
    setFilePreview(null);
    setUploadComplete(false);
    setReportId(null);
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return (
    <div className="max-w-3xl mx-auto">
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Beta Feature</AlertTitle>
        <AlertDescription>
          The Report Scanner feature is in beta. Results should be reviewed by a medical professional.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="image" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Medical Images</span>
          </TabsTrigger>
          <TabsTrigger value="report" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Text Reports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="image" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Medical Image</CardTitle>
              <CardDescription>
                Upload X-rays, MRIs, CT scans, or other medical images for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!uploadComplete ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="medical-image">Upload Image</Label>
                    <Input
                      id="medical-image"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                      disabled={isUploading || isAnalyzing}
                    />
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG, DICOM, PDF
                    </p>
                  </div>
                  
                  {filePreview && (
                    <div className="mt-4 border rounded-md overflow-hidden">
                      <img 
                        src={filePreview} 
                        alt="Medical image preview" 
                        className="max-h-80 mx-auto"
                      />
                    </div>
                  )}
                  
                  {file && !filePreview && (
                    <div className="mt-4 border rounded-md p-8 text-center">
                      <FileText className="h-16 w-16 mx-auto text-gray-400" />
                      <p className="mt-2 text-gray-600">{file.name}</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!file || isUploading || isAnalyzing}
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </span>
                    ) : isAnalyzing ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload for Analysis
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center p-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-4 text-xl font-medium">Analysis Complete!</h3>
                  <p className="mt-2 text-gray-500">
                    Your medical image has been processed successfully.
                  </p>
                  <div className="mt-6 space-y-3">
                    <Button onClick={viewAnalysisResults} className="w-full" variant="outline">
                      View Analysis Results
                    </Button>
                    <Button onClick={resetUpload} className="w-full">
                      Upload Another Report
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col bg-gray-50">
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium">What kind of images can I upload?</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>X-ray images (chest, bone, joint)</li>
                  <li>CT scan images</li>
                  <li>MRI images</li>
                  <li>Ultrasound images</li>
                  <li>Other medical imaging results</li>
                </ul>
                <Separator className="my-2" />
                <p className="text-xs text-gray-500">
                  <strong>Note:</strong> All uploads are encrypted and processed securely. We do not store your 
                  medical images beyond the analysis period unless you explicitly choose to save them.
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="report" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Medical Report</CardTitle>
              <CardDescription>
                Upload blood test reports, pathology reports, or other medical documents for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!uploadComplete ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="medical-report">Upload Report</Label>
                    <Input
                      id="medical-report"
                      type="file"
                      accept=".pdf,.jpg,.png,.doc,.docx"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                      disabled={isUploading || isAnalyzing}
                    />
                    <p className="text-xs text-gray-500">
                      Supported formats: PDF, JPG, PNG, DOC, DOCX
                    </p>
                  </div>
                  
                  {file && (
                    <div className="mt-4 border rounded-md p-8 text-center">
                      <FileText className="h-16 w-16 mx-auto text-gray-400" />
                      <p className="mt-2 text-gray-600">{file.name}</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!file || isUploading || isAnalyzing}
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </span>
                    ) : isAnalyzing ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload for Analysis
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center p-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-4 text-xl font-medium">Analysis Complete!</h3>
                  <p className="mt-2 text-gray-500">
                    Your medical report has been processed successfully.
                  </p>
                  <div className="mt-6 space-y-3">
                    <Button onClick={viewAnalysisResults} className="w-full" variant="outline">
                      View Analysis Results
                    </Button>
                    <Button onClick={resetUpload} className="w-full">
                      Upload Another Report
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col bg-gray-50">
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium">What kind of reports can I upload?</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Blood test reports</li>
                  <li>Complete blood count (CBC) reports</li>
                  <li>Lipid profile reports</li>
                  <li>Thyroid function tests</li>
                  <li>Other pathology reports</li>
                </ul>
                <Separator className="my-2" />
                <p className="text-xs text-gray-500">
                  <strong>Note:</strong> This feature can identify abnormal values and provide general 
                  information but should not replace professional medical interpretation.
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analysis Results Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Analysis Results</DialogTitle>
            <DialogDescription>
              AI-generated analysis of your medical report
            </DialogDescription>
          </DialogHeader>
          
          {analysisResult && (
            <ReportAnalysisResult analysisResult={analysisResult} />
          )}
          
          {analysisError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription>{analysisError}</AlertDescription>
            </Alert>
          )}
          
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportUpload;
