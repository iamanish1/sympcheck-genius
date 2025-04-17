import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface UserDetailsFormProps {
  onNext: (userData: UserFormData) => void;
}

export interface UserFormData {
  name: string;
  age: string;
  gender: string;
  location: string;
  phoneNumber: string;
  existingConditions: string; // This will be used as medicalHistory
  allergies: string;
  currentMedications: string; // This will be used as medications
}

const UserDetailsForm = ({ onNext }: UserDetailsFormProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    age: "",
    gender: "male",
    location: "",
    phoneNumber: "",
    existingConditions: "",
    allergies: "",
    currentMedications: ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};
    let isValid = true;

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
      isValid = false;
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0 || Number(formData.age) > 120) {
      newErrors.age = "Please enter a valid age";
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter your full name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age <span className="text-red-500">*</span></Label>
            <Input
              id="age"
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
              placeholder="Your age"
              className={errors.age ? "border-red-500" : ""}
            />
            {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age}</p>}
          </div>

          <div>
            <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => handleChange("gender", value)}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="cursor-pointer">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="cursor-pointer">Other</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="City, State"
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="Your phone number (optional)"
          />
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-medium">Medical History</h3>
        
        <div>
          <Label htmlFor="existingConditions">Existing Medical Conditions</Label>
          <Textarea
            id="existingConditions"
            value={formData.existingConditions}
            onChange={(e) => handleChange("existingConditions", e.target.value)}
            placeholder="E.g., Diabetes, Hypertension, Asthma (if any)"
            className="min-h-[80px]"
          />
        </div>
        
        <div>
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea
            id="allergies"
            value={formData.allergies}
            onChange={(e) => handleChange("allergies", e.target.value)}
            placeholder="List any known allergies (if any)"
            className="min-h-[80px]"
          />
        </div>
        
        <div>
          <Label htmlFor="currentMedications">Current Medications</Label>
          <Textarea
            id="currentMedications"
            value={formData.currentMedications}
            onChange={(e) => handleChange("currentMedications", e.target.value)}
            placeholder="List any medications you're currently taking (if any)"
            className="min-h-[80px]"
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full md:w-auto">
        Next: Enter Symptoms
      </Button>
    </form>
  );
};

export default UserDetailsForm;
