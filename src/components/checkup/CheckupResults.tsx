
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  Info, 
  Pill, 
  ThumbsUp, 
  Home, 
  MapPin,
  PhoneCall
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserFormData } from "./UserDetailsForm";
import { SymptomData } from "./SymptomInput";
import { Separator } from "@/components/ui/separator";

interface CheckupResultsProps {
  userData: UserFormData;
  symptomData: SymptomData;
  onRestart: () => void;
}

// Mock data for demonstration purposes
// In a real app, this would come from an AI model
const mockAnalysis = {
  likelyConditions: [
    {
      name: "Common Cold",
      confidence: "High",
      description: "A viral infection of the nose and throat"
    },
    {
      name: "Seasonal Allergies",
      confidence: "Medium",
      description: "An immune response to environmental triggers"
    }
  ],
  reasoning: "Based on your symptoms of headache, cough, and sore throat, along with the duration of your symptoms and the time of year, the most likely cause is a common cold or seasonal allergies.",
  medications: [
    "Over-the-counter pain reliever like acetaminophen (Tylenol) or ibuprofen (Advil) for pain and fever",
    "Antihistamines like cetirizine (Zyrtec) or loratadine (Claritin) if allergies are suspected"
  ],
  homeRemedies: [
    "Rest and stay hydrated",
    "Gargle with warm salt water for sore throat relief",
    "Use a humidifier or take steamy showers to ease congestion",
    "Honey and lemon tea for cough relief (for adults and children over 1 year of age)"
  ],
  doctorVisitRecommended: false,
  urgency: "Low",
  nearbyDoctors: [
    {
      name: "Dr. Sarah Johnson",
      specialty: "General Practitioner",
      distance: "1.2 miles",
      phone: "555-123-4567"
    },
    {
      name: "Dr. Michael Lee",
      specialty: "Family Medicine",
      distance: "2.4 miles",
      phone: "555-987-6543"
    }
  ]
};

const CheckupResults = ({ userData, symptomData, onRestart }: CheckupResultsProps) => {
  const { likelyConditions, reasoning, medications, homeRemedies, doctorVisitRecommended, urgency, nearbyDoctors } = mockAnalysis;
  
  // Combine all symptoms for display
  const allSymptoms = [...symptomData.selectedSymptoms];
  
  // Format the duration
  const formattedDuration = symptomData.durationValue ? 
    `${symptomData.durationValue} ${symptomData.durationUnit}` : 
    "Not specified";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Your Health Analysis</h2>
        <p className="text-gray-500">
          Based on the symptoms and information you provided, here's what our AI analysis suggests.
        </p>
      </div>
      
      {doctorVisitRecommended && urgency === "High" && (
        <Alert variant="destructive" className="bg-red-50 border-red-300">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Medical attention recommended</AlertTitle>
          <AlertDescription>
            Your symptoms suggest you should seek medical attention promptly. Please contact a healthcare provider or emergency services if symptoms worsen.
          </AlertDescription>
        </Alert>
      )}

      {!doctorVisitRecommended && (
        <Alert className="bg-green-50 border-green-300">
          <ThumbsUp className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Good news</AlertTitle>
          <AlertDescription className="text-green-700">
            Your symptoms don't appear to require immediate medical attention. However, monitor your symptoms and seek medical help if they worsen.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-primary" />
              Likely Conditions
            </CardTitle>
            <CardDescription>
              Based on your reported symptoms and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {likelyConditions.map((condition, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-lg">{condition.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    condition.confidence === "High" 
                      ? "bg-green-100 text-green-800" 
                      : condition.confidence === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {condition.confidence} Match
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{condition.description}</p>
              </div>
            ))}
            
            <div className="pt-4">
              <h3 className="text-sm font-medium text-gray-500">AI Reasoning</h3>
              <p className="mt-1 text-gray-700">{reasoning}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Reported Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-500">Basic Details</h3>
              <p className="text-gray-900 mt-1">{userData.name}, {userData.age}, {userData.gender}</p>
              <p className="text-gray-500 mt-1">{userData.location}</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium text-gray-500">Reported Symptoms</h3>
              <div className="mt-1 flex flex-wrap gap-1">
                {allSymptoms.map((symptom, index) => (
                  <span key={index} className="inline-block px-2 py-1 bg-gray-100 rounded text-gray-700 text-xs">
                    {symptom}
                  </span>
                ))}
              </div>
              <p className="text-gray-700 mt-2">Duration: {formattedDuration}</p>
            </div>
            
            {(userData.existingConditions || userData.allergies) && (
              <>
                <Separator />
                <div>
                  {userData.existingConditions && (
                    <div className="mb-2">
                      <h3 className="font-medium text-gray-500">Medical Conditions</h3>
                      <p className="text-gray-700 mt-1">{userData.existingConditions}</p>
                    </div>
                  )}
                  {userData.allergies && (
                    <div>
                      <h3 className="font-medium text-gray-500">Allergies</h3>
                      <p className="text-gray-700 mt-1">{userData.allergies}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Pill className="h-5 w-5 mr-2 text-primary" />
              Suggested Medications
            </CardTitle>
            <CardDescription>
              Common over-the-counter options that may help
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {medications.map((medication, index) => (
                <li key={index} className="text-gray-700 flex">
                  <span className="mr-2 text-primary">•</span>
                  <span>{medication}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t text-sm text-gray-500">
              <p className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Always consult a healthcare professional before taking any medication
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="h-5 w-5 mr-2 text-primary" />
              Home Remedies
            </CardTitle>
            <CardDescription>
              Things you can try at home to feel better
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {homeRemedies.map((remedy, index) => (
                <li key={index} className="text-gray-700 flex">
                  <span className="mr-2 text-primary">•</span>
                  <span>{remedy}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            Nearby Healthcare Providers
          </CardTitle>
          <CardDescription>
            Based on your location: {userData.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearbyDoctors.map((doctor, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-medium">{doctor.name}</h3>
                <p className="text-gray-500 text-sm">{doctor.specialty}</p>
                <div className="mt-2 text-sm flex flex-wrap gap-y-1 gap-x-4">
                  <span className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" /> {doctor.distance}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <PhoneCall className="h-4 w-4 mr-1" /> {doctor.phone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <Button onClick={onRestart} size="lg" variant="outline" className="w-full sm:w-auto">
          Start New Checkup
        </Button>
        <Button size="lg" className="w-full sm:w-auto">
          Email Results
        </Button>
      </div>
      
      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
        <p className="font-medium">Disclaimer:</p>
        <p>This analysis is provided for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
      </div>
    </div>
  );
};

export default CheckupResults;
