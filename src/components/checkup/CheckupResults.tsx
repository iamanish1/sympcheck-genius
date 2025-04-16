
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ThumbsUp, AlertTriangle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { UserFormData } from "./UserDetailsForm";
import { SymptomData } from "./SymptomInput";
import { analyzeUserSymptoms, SymptomAnalysisResult } from "../../api/symptomService";
import AIProcessingStatus from "../reports/AIProcessingStatus";

interface CheckupResultsProps {
  userData: UserFormData;
  symptomData: SymptomData;
  onRestart: () => void;
}

const CheckupResults: React.FC<CheckupResultsProps> = ({ userData, symptomData, onRestart }) => {
  const [analysisResult, setAnalysisResult] = useState<SymptomAnalysisResult | null>(null);
  const [aiStatus, setAiStatus] = useState<'loading' | 'processing' | 'complete' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        setAiStatus('loading');
        
        // Extract just the symptoms as an array
        const symptoms = symptomData.symptoms.map(s => s.text);
        
        // Short delay for UI feedback
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAiStatus('processing');
        
        // Get analysis results using our AI-powered service
        const results = await analyzeUserSymptoms(symptoms, {
          age: userData.age,
          gender: userData.gender,
          medicalHistory: userData.medicalHistory,
          medications: userData.currentMedications
        });
        
        setAnalysisResult(results);
        setAiStatus('complete');
      } catch (err) {
        console.error('Analysis error:', err);
        setError('Failed to analyze symptoms. Please try again.');
        setAiStatus('error');
      }
    };
    
    performAnalysis();
  }, [userData, symptomData]);

  if (aiStatus !== 'complete') {
    return (
      <div className="py-8">
        <AIProcessingStatus 
          stage={aiStatus} 
          progress={aiStatus === 'loading' ? 30 : aiStatus === 'processing' ? 70 : 100}
          message={error || undefined}
        />
      </div>
    );
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Your Health Assessment</h2>
        <p className="text-gray-500">
          AI-powered analysis of your symptoms
        </p>
      </div>

      {analysisResult && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Analysis Results</CardTitle>
                <Badge className={getUrgencyColor(analysisResult.urgencyLevel)}>
                  {analysisResult.urgencyLevel} Urgency
                </Badge>
              </div>
              <CardDescription>
                Based on the symptoms and information you provided
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Possible Conditions</h3>
                <div className="space-y-3">
                  {analysisResult.possibleConditions.map((condition, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{condition.name}</span>
                        <Badge variant="outline">
                          {Math.round(condition.probability * 100)}% match
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{condition.description}</p>
                      <Progress 
                        value={condition.probability * 100} 
                        className="h-1.5 mt-2" 
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Recommendations</h3>
                <ul className="space-y-1">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {analysisResult.followUpRecommended && (
                <>
                  <Separator />
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Professional Follow-up Recommended</AlertTitle>
                    <AlertDescription>
                      Based on your symptoms, we recommend consulting with a healthcare professional for a complete evaluation.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 bg-gray-50 rounded-b-lg">
              <p className="text-sm text-gray-600">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                This is an AI-powered preliminary assessment and not a medical diagnosis.
              </p>
              <Button onClick={onRestart} className="w-full">
                Start New Assessment
              </Button>
            </CardFooter>
          </Card>
          
          <Alert variant="default" className="bg-primary/10 border-primary/20">
            <ThumbsUp className="h-4 w-4" />
            <AlertTitle>How was your experience?</AlertTitle>
            <AlertDescription>
              Help us improve by providing feedback on your AI health assessment experience.
            </AlertDescription>
          </Alert>
        </>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>
            {error} 
            <Button variant="outline" size="sm" onClick={onRestart} className="ml-2">
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CheckupResults;
