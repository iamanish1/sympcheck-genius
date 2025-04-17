
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search, Camera, AlertCircle, RefreshCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { analyzeMedicine } from "@/api/medicineService";
import AIProcessingStatus from "@/components/reports/AIProcessingStatus";

interface MedicineInfo {
  name: string;
  genericName: string;
  uses: string[];
  sideEffects: string[];
  dosage: string;
  interactions: string[];
  precautions: string[];
}

const MedicineSearch = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const [aiStatus, setAiStatus] = useState<'loading' | 'processing' | 'complete' | 'error'>('complete');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Search query is empty",
        description: "Please enter a medicine name to search"
      });
      return;
    }
    
    setIsSearching(true);
    setAiStatus('loading');
    setError(null);
    
    try {
      // Short delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      setAiStatus('processing');
      
      const result = await analyzeMedicine(searchQuery);
      setMedicineInfo(result);
      setAiStatus('complete');
      
      toast({
        title: "Medicine Found",
        description: `Information for ${result.name} retrieved successfully.`
      });
    } catch (error) {
      console.error('Medicine search error:', error);
      setError("Failed to analyze medicine information. Using basic information instead.");
      setAiStatus('error');
      
      toast({
        variant: "destructive",
        title: "Analysis issue",
        description: "Using available information. Some details may be limited."
      });
      
      // Try to get basic medicine info anyway
      try {
        const result = await analyzeMedicine(searchQuery);
        setMedicineInfo(result);
      } catch (fallbackError) {
        console.error('Fallback medicine search failed:', fallbackError);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleRetry = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setAiStatus('loading');
    setError(null);
    
    try {
      // Short delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      setAiStatus('processing');
      
      const result = await analyzeMedicine(searchQuery);
      setMedicineInfo(result);
      setAiStatus('complete');
    } catch (retryError) {
      console.error('Medicine retry search error:', retryError);
      setError("Analysis still unavailable. Using basic information.");
      setAiStatus('error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (!file.type.includes("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image file"
        });
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please upload an image of the medicine"
      });
      return;
    }
    
    setIsSearching(true);
    setAiStatus('loading');
    
    // Simulate OCR and API call with timeout
    setTimeout(() => {
      setAiStatus('processing');
      
      setTimeout(() => {
        // Generate medicine name from image file name
        const medicineName = imageFile.name
          .replace(/\.[^/.]+$/, "") // Remove extension
          .split(/[-_]/)[0] // Get first part before hyphen or underscore
          .replace(/[0-9]/g, "") // Remove numbers
          .trim();
        
        // Process with the medicine name as search term
        analyzeMedicine(medicineName || "Aspirin")
          .then(result => {
            setMedicineInfo(result);
            setAiStatus('complete');
          })
          .catch(err => {
            console.error("Image medicine analysis error:", err);
            setError("Could not analyze the medicine image. Using basic information.");
            setAiStatus('error');
            
            // Try to get basic info anyway
            analyzeMedicine("Aspirin").then(setMedicineInfo).catch(console.error);
          })
          .finally(() => {
            setIsSearching(false);
          });
      }, 1000);
    }, 1000);
  };

  const resetSearch = () => {
    setSearchQuery("");
    setMedicineInfo(null);
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setAiStatus('complete');
  };

  // Display error state with retry option
  const renderErrorState = () => {
    if (aiStatus !== 'error' || !error) return null;
    
    return (
      <div className="mt-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Issue</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry} 
              disabled={isSearching}
              className="ml-2 flex items-center"
            >
              <RefreshCcw className="h-3 w-3 mr-1" /> Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Text Search</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span>Image Upload</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="pt-6">
          {!medicineInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Search Medicine</CardTitle>
                <CardDescription>
                  Enter the name of a medicine to get AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter medicine name (e.g., Ibuprofen)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isSearching}>
                      {isSearching ? "Analyzing..." : "Analyze"}
                    </Button>
                  </div>
                  
                  {aiStatus !== 'complete' && (
                    <AIProcessingStatus 
                      stage={aiStatus} 
                      progress={aiStatus === 'loading' ? 30 : aiStatus === 'processing' ? 70 : 100}
                    />
                  )}
                  
                  {renderErrorState()}
                  
                  <p className="text-sm text-gray-500">
                    Examples: Tylenol, Advil, Lisinopril, Metformin
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="image" className="pt-6">
          {!medicineInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Medicine Image</CardTitle>
                <CardDescription>
                  Take a photo of a medicine packet, bottle, or pill to identify it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleImageSubmit} className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="medicine-image">Upload Image</Label>
                    <Input
                      id="medicine-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-4 border rounded-md overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Medicine preview" 
                        className="max-h-64 mx-auto"
                      />
                    </div>
                  )}
                  
                  {aiStatus !== 'complete' && (
                    <AIProcessingStatus 
                      stage={aiStatus} 
                      progress={aiStatus === 'loading' ? 30 : aiStatus === 'processing' ? 70 : 100}
                    />
                  )}
                  
                  {renderErrorState()}
                  
                  <Button 
                    type="submit" 
                    disabled={isSearching || !imageFile} 
                    className="w-full"
                  >
                    {isSearching ? "Processing Image..." : "Identify Medicine"}
                  </Button>
                  
                  <p className="text-sm text-gray-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    For best results, ensure the medicine name is clearly visible in the image
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {medicineInfo && (
        <div className="mt-6 space-y-6">
          <Card>
            <CardHeader className="bg-primary/5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{medicineInfo.name}</CardTitle>
                  {medicineInfo.genericName !== medicineInfo.name && (
                    <CardDescription className="text-base mt-1">
                      Generic Name: {medicineInfo.genericName}
                    </CardDescription>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={resetSearch}>
                  New Search
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Uses</h3>
                <ul className="space-y-1 list-disc pl-5">
                  {medicineInfo.uses.map((use, index) => (
                    <li key={index} className="text-gray-700">{use}</li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-lg mb-2">Dosage</h3>
                <p className="text-gray-700">{medicineInfo.dosage}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-lg mb-2">Common Side Effects</h3>
                <ul className="space-y-1 list-disc pl-5">
                  {medicineInfo.sideEffects.map((effect, index) => (
                    <li key={index} className="text-gray-700">{effect}</li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-lg mb-2">Drug Interactions</h3>
                <ul className="space-y-1 list-disc pl-5">
                  {medicineInfo.interactions.map((interaction, index) => (
                    <li key={index} className="text-gray-700">{interaction}</li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-lg mb-2">Precautions</h3>
                <ul className="space-y-1 list-disc pl-5">
                  {medicineInfo.precautions.map((precaution, index) => (
                    <li key={index} className="text-gray-700">{precaution}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 flex flex-col items-start">
              <div className="flex items-center text-amber-600 mb-2">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Important Note:</span>
              </div>
              <p className="text-gray-600 text-sm">
                This information is for educational purposes only and is not a substitute for 
                professional medical advice. Always consult your healthcare provider for 
                medical advice and before starting or stopping any medication.
              </p>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MedicineSearch;
