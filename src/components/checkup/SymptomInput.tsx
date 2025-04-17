import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface SymptomInputProps {
  onSubmit: (symptoms: SymptomData) => void;
  onBack: () => void;
}

export interface SymptomData {
  selectedSymptoms: string[];
  customSymptom: string;
  symptomsDescription: string;
  durationValue: string;
  durationUnit: string;
  lifestyleFactors: string[];
}

// Common symptoms list
const commonSymptoms = [
  "Headache", "Fever", "Cough", "Sore Throat", "Fatigue", 
  "Shortness of Breath", "Nausea", "Vomiting", "Dizziness",
  "Chest Pain", "Abdominal Pain", "Back Pain", "Joint Pain",
  "Muscle Pain", "Rash", "Itching", "Diarrhea", "Constipation",
  "Loss of Appetite", "Difficulty Swallowing", "Blurred Vision"
];

// Lifestyle factors
const lifestyleFactors = [
  "Smoking",
  "Alcohol Consumption",
  "Sedentary Lifestyle",
  "Poor Diet",
  "Stress",
  "Sleep Issues",
  "Recent Travel"
];

const SymptomInput = ({ onSubmit, onBack }: SymptomInputProps) => {
  const [symptomData, setSymptomData] = useState<SymptomData>({
    selectedSymptoms: [],
    customSymptom: "",
    symptomsDescription: "",
    durationValue: "",
    durationUnit: "days",
    lifestyleFactors: []
  });

  const [errors, setErrors] = useState<{
    symptoms?: string;
    durationValue?: string;
  }>({});

  const addSymptom = (symptom: string) => {
    if (
      symptom &&
      !symptomData.selectedSymptoms.includes(symptom)
    ) {
      setSymptomData({
        ...symptomData,
        selectedSymptoms: [...symptomData.selectedSymptoms, symptom]
      });
      
      // Clear error if it exists
      if (errors.symptoms) {
        setErrors({ ...errors, symptoms: undefined });
      }
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptomData({
      ...symptomData,
      selectedSymptoms: symptomData.selectedSymptoms.filter(s => s !== symptom)
    });
  };

  const handleCustomSymptomAdd = () => {
    if (symptomData.customSymptom.trim()) {
      addSymptom(symptomData.customSymptom.trim());
      setSymptomData({ ...symptomData, customSymptom: "" });
    }
  };

  const handleLifestyleToggle = (value: string) => {
    const currentFactors = [...symptomData.lifestyleFactors];
    
    if (currentFactors.includes(value)) {
      setSymptomData({
        ...symptomData,
        lifestyleFactors: currentFactors.filter(factor => factor !== value)
      });
    } else {
      setSymptomData({
        ...symptomData,
        lifestyleFactors: [...currentFactors, value]
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { symptoms?: string; durationValue?: string } = {};
    let isValid = true;

    if (symptomData.selectedSymptoms.length === 0) {
      newErrors.symptoms = "Please select at least one symptom";
      isValid = false;
    }

    if (symptomData.durationValue && isNaN(Number(symptomData.durationValue))) {
      newErrors.durationValue = "Please enter a valid number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(symptomData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="symptoms">Select Symptoms <span className="text-red-500">*</span></Label>
          
          <div className="mt-2 mb-4 flex flex-wrap gap-2">
            {symptomData.selectedSymptoms.map((symptom) => (
              <Badge key={symptom} variant="secondary" className="py-1.5 px-3 text-sm">
                {symptom}
                <button 
                  type="button"
                  onClick={() => removeSymptom(symptom)}
                  className="ml-2 text-gray-400 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
            {commonSymptoms.map((symptom) => (
              <Button
                key={symptom}
                type="button"
                variant={symptomData.selectedSymptoms.includes(symptom) ? "default" : "outline"}
                size="sm"
                className={`justify-start h-auto py-2 ${
                  symptomData.selectedSymptoms.includes(symptom) 
                    ? "bg-primary/80 hover:bg-primary" 
                    : ""
                }`}
                onClick={() => 
                  symptomData.selectedSymptoms.includes(symptom) 
                    ? removeSymptom(symptom) 
                    : addSymptom(symptom)
                }
              >
                {symptomData.selectedSymptoms.includes(symptom) && (
                  <div className="mr-1 text-xs">✓</div>
                )}
                <span>{symptom}</span>
              </Button>
            ))}
          </div>
          
          {errors.symptoms && <p className="text-sm text-red-500 mt-2">{errors.symptoms}</p>}
        </div>

        <div className="flex gap-2 mt-4">
          <div className="flex-grow">
            <Input
              placeholder="Enter other symptom"
              value={symptomData.customSymptom}
              onChange={(e) => 
                setSymptomData({ ...symptomData, customSymptom: e.target.value })
              }
              className="flex-1"
            />
          </div>
          <Button 
            type="button"
            onClick={handleCustomSymptomAdd} 
            disabled={!symptomData.customSymptom.trim()}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="symptomsDescription">Describe Your Symptoms</Label>
        <Textarea
          id="symptomsDescription"
          placeholder="Please describe your symptoms in detail (e.g., when they started, how severe they are, etc.)"
          value={symptomData.symptomsDescription}
          onChange={(e) => 
            setSymptomData({ ...symptomData, symptomsDescription: e.target.value })
          }
          className="min-h-[120px]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Symptoms Duration</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="duration"
              type="text"
              inputMode="numeric"
              placeholder="Duration"
              value={symptomData.durationValue}
              onChange={(e) => 
                setSymptomData({ ...symptomData, durationValue: e.target.value })
              }
              className={`w-24 ${errors.durationValue ? "border-red-500" : ""}`}
            />
            <Select 
              value={symptomData.durationUnit}
              onValueChange={(value) => 
                setSymptomData({ ...symptomData, durationUnit: value })
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.durationValue && <p className="text-sm text-red-500 mt-1">{errors.durationValue}</p>}
        </div>
      </div>

      <div>
        <Label>Lifestyle Factors</Label>
        <div className="mt-2 space-y-2">
          {lifestyleFactors.map((factor) => (
            <div key={factor} className="flex items-center space-x-2">
              <Checkbox 
                id={`lifestyle-${factor}`}
                checked={symptomData.lifestyleFactors.includes(factor)}
                onCheckedChange={() => handleLifestyleToggle(factor)}
              />
              <label
                htmlFor={`lifestyle-${factor}`}
                className="text-sm leading-none cursor-pointer"
              >
                {factor}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">
          Submit & Get Analysis
        </Button>
      </div>
    </form>
  );
};

export default SymptomInput;
