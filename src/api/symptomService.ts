
import { analyzeSymptoms } from './aiService';

export interface SymptomAnalysisResult {
  possibleConditions: {
    name: string;
    probability: number;
    description: string;
  }[];
  recommendations: string[];
  urgencyLevel: 'Low' | 'Medium' | 'High' | 'Emergency';
  followUpRecommended: boolean;
}

export interface UserHealthData {
  age: number;
  gender: string;
  weight?: number;
  height?: number;
  medicalHistory?: string;
  medications?: string;
}

export const analyzeUserSymptoms = async (
  symptoms: string[], 
  userData: UserHealthData
): Promise<SymptomAnalysisResult> => {
  try {
    console.log('Analyzing symptoms:', symptoms);
    console.log('User data:', userData);

    // Use the AI service to analyze the symptoms
    const result = await analyzeSymptoms(symptoms, userData);
    return result as SymptomAnalysisResult;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw new Error('Failed to analyze symptoms. Please try again later.');
  }
};
