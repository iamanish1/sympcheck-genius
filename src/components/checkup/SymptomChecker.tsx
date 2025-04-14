
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import UserDetailsForm, { UserFormData } from "./UserDetailsForm";
import SymptomInput, { SymptomData } from "./SymptomInput";
import CheckupResults from "./CheckupResults";

type Step = "userDetails" | "symptoms" | "results";

const SymptomChecker = () => {
  const [step, setStep] = useState<Step>("userDetails");
  const [userData, setUserData] = useState<UserFormData | null>(null);
  const [symptomData, setSymptomData] = useState<SymptomData | null>(null);
  const [progress, setProgress] = useState(33);
  
  const handleUserDataSubmit = (data: UserFormData) => {
    setUserData(data);
    setStep("symptoms");
    setProgress(66);
  };
  
  const handleSymptomSubmit = (data: SymptomData) => {
    setSymptomData(data);
    setStep("results");
    setProgress(100);
  };
  
  const handleBack = () => {
    setStep("userDetails");
    setProgress(33);
  };
  
  const handleRestart = () => {
    setStep("userDetails");
    setProgress(33);
    setSymptomData(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="space-y-1 mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Personal Details</span>
          <span>Symptoms</span>
          <span>Analysis</span>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {step === "userDetails" && (
            <UserDetailsForm onNext={handleUserDataSubmit} />
          )}
          
          {step === "symptoms" && userData && (
            <SymptomInput 
              onSubmit={handleSymptomSubmit}
              onBack={handleBack}
            />
          )}
          
          {step === "results" && userData && symptomData && (
            <CheckupResults 
              userData={userData}
              symptomData={symptomData}
              onRestart={handleRestart}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SymptomChecker;
