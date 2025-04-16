import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search, Camera, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
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

const mockMedicineInfo: MedicineInfo = {
  name: "Ibuprofen",
  genericName: "Ibuprofen",
  uses: [
    "Relief of mild to moderate pain",
    "Treatment of inflammatory conditions like arthritis",
    "Reduction of fever",
    "Relief of menstrual cramps"
  ],
  sideEffects: [
    "Upset stomach or heartburn",
    "Nausea or vomiting",
    "Headache or dizziness",
    "Mild rash or itching",
    "Risk of heart attack or stroke with long-term use"
  ],
  dosage: "Adults: 200-400mg every 4-6 hours as needed, not exceeding 1200mg per day unless directed by doctor.",
  interactions: [
    "Blood thinners (e.g., warfarin)",
    "Other NSAIDs (aspirin, naproxen)",
    "ACE inhibitors for high blood pressure",
    "Diuretics (water pills)",
    "Lithium"
  ],
  precautions: [
    "Not recommended for people with history of heart problems or stroke",
    "Use caution if you have kidney disease, liver disease, or asthma",
    "Avoid during the last 3 months of pregnancy",
    "May increase bleeding risk during surgery"
  ]
};

const MedicineSearch = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const [aiStatus, setAiStatus] = useState<'loading' | 'processing' | 'complete' | 'error'>('complete');
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
    
    try {
      const result = await analyzeMedicine(searchQuery);
      setMedicineInfo(result);
      setAiStatus('complete');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "Failed to analyze medicine information. Please try again."
      });
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
    
    // Simulate OCR and API call with timeout
    setTimeout(() => {
      setMedicineInfo(mockMedicineInfo);
      setIsSearching(false);
    }, 2000);
  };

  const resetSearch = () => {
    setSearchQuery("");
    setMedicineInfo(null);
    setImageFile(null);
    setImagePreview(null);
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
