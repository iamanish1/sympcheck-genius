
import { pipeline } from '@huggingface/transformers';
import { AI_CONFIG } from './config';

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

let symptomModel: any = null;

const initializeSymptomModel = async () => {
  if (!symptomModel) {
    console.log('Initializing symptom analysis model...');
    try {
      symptomModel = await pipeline(
        'text-classification',
        AI_CONFIG.models.symptoms,
        { device: 'webgpu' }  // Changed from 'cpu' to 'webgpu'
      );
      console.log('Symptom analysis model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize symptom model:', error);
      throw error;
    }
  }
  return symptomModel;
};

export const analyzeSymptoms = async (symptoms: string[], userData: UserHealthData): Promise<SymptomAnalysisResult> => {
  try {
    console.log('Analyzing symptoms:', symptoms);
    console.log('User data:', userData);

    // Use the AI model to analyze the symptoms
    const model = await initializeSymptomModel();
    
    // Prepare the input for the model
    const prompt = `Patient information: Age ${userData.age}, Gender: ${userData.gender}
    Medical history: ${userData.medicalHistory || 'None'}
    Current medications: ${userData.medications || 'None'}
    Symptoms: ${symptoms.join(', ')}
    
    Analyze these symptoms and provide a preliminary assessment.`;
    
    console.log('Analyzing symptoms with AI model:', prompt);
    const result = await model(prompt);
    console.log('AI analysis result:', result);
    
    // For demonstration, we'll return structured output
    // In a real application, this would be based on the model's output
    return {
      possibleConditions: [
        {
          name: 'Common Cold',
          probability: 0.75,
          description: 'A viral infection of the upper respiratory tract'
        },
        {
          name: 'Seasonal Allergy',
          probability: 0.45,
          description: 'An immune system response to environmental allergens'
        }
      ],
      recommendations: [
        'Rest and stay hydrated',
        'Consider over-the-counter cold medications',
        'Consult a doctor if symptoms worsen or persist beyond 7 days'
      ],
      urgencyLevel: 'Low',
      followUpRecommended: symptoms.length > 3
    };
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw new Error('Failed to analyze symptoms. Please try again later.');
  }
};

export const analyzeUserSymptoms = async (
  symptoms: string[], 
  userData: UserHealthData
): Promise<SymptomAnalysisResult> => {
  try {
    return await analyzeSymptoms(symptoms, userData);
  } catch (error) {
    console.error('Error analyzing user symptoms:', error);
    throw new Error('Failed to analyze symptoms. Please try again later.');
  }
};
