
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
let modelInitializationAttempted = false;

const initializeSymptomModel = async () => {
  if (!symptomModel && !modelInitializationAttempted) {
    modelInitializationAttempted = true;
    console.log('Initializing symptom analysis model...');
    try {
      const { pipeline } = await import('@huggingface/transformers');
      symptomModel = await pipeline(
        'text-classification',
        AI_CONFIG.models.symptoms,
        { device: 'webgpu' }
      );
      console.log('Symptom analysis model initialized successfully');
      return symptomModel;
    } catch (error) {
      console.error('Failed to initialize symptom model:', error);
      // Don't throw, just return null
      return null;
    }
  }
  return symptomModel;
};

export const analyzeSymptoms = async (symptoms: string[], userData: UserHealthData): Promise<SymptomAnalysisResult> => {
  try {
    console.log('Analyzing symptoms:', symptoms);
    console.log('User data:', userData);

    // Try to initialize the model, but don't wait for success
    try {
      await initializeSymptomModel();
    } catch (err) {
      console.log('Model initialization skipped due to error');
    }
    
    // If model is available, use it
    if (symptomModel) {
      // Prepare the input for the model
      const prompt = `Patient information: Age ${userData.age}, Gender: ${userData.gender}
      Medical history: ${userData.medicalHistory || 'None'}
      Current medications: ${userData.medications || 'None'}
      Symptoms: ${symptoms.join(', ')}
      
      Analyze these symptoms and provide a preliminary assessment.`;
      
      try {
        console.log('Analyzing symptoms with AI model:', prompt);
        const result = await symptomModel(prompt);
        console.log('AI analysis result:', result);
        // Use AI result to enhance the mockup result
      } catch (modelError) {
        console.error('Model analysis failed:', modelError);
      }
    }
    
    // Generate analysis based on symptoms
    return generateAnalysis(symptoms, userData);
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    // Return fallback analysis even if there's an error
    return generateAnalysis(symptoms, userData);
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
    return generateAnalysis(symptoms, userData);
  }
};

// Helper function to generate analysis based on symptoms
function generateAnalysis(symptoms: string[], userData: UserHealthData): SymptomAnalysisResult {
  // Basic logic for symptom severity estimation
  const highSeveritySymptoms = ['Chest Pain', 'Difficulty Breathing', 'Severe Headache', 'Seizure', 'Unconsciousness'];
  const mediumSeveritySymptoms = ['Fever', 'Persistent Cough', 'Vomiting', 'Dizziness', 'Abdominal Pain'];
  
  const hasHighSeverity = symptoms.some(s => highSeveritySymptoms.includes(s));
  const hasMediumSeverity = symptoms.some(s => mediumSeveritySymptoms.includes(s));
  
  let urgency: 'Low' | 'Medium' | 'High' | 'Emergency' = 'Low';
  let followUpRecommended = false;
  
  if (hasHighSeverity) {
    urgency = symptoms.includes('Chest Pain') || symptoms.includes('Difficulty Breathing') 
      ? 'Emergency' 
      : 'High';
    followUpRecommended = true;
  } else if (hasMediumSeverity) {
    urgency = 'Medium';
    followUpRecommended = true;
  } else if (symptoms.length > 2) {
    followUpRecommended = true;
  }
  
  // Generate some basic conditions based on symptoms
  const conditions: {name: string; probability: number; description: string}[] = [];
  
  // Common cold symptoms
  if (symptoms.includes('Cough') || symptoms.includes('Sore Throat') || symptoms.includes('Runny Nose')) {
    conditions.push({
      name: 'Common Cold',
      probability: 0.75,
      description: 'A viral infection of the upper respiratory tract'
    });
  }
  
  // Flu symptoms
  if (symptoms.includes('Fever') || symptoms.includes('Fatigue') || symptoms.includes('Body Aches')) {
    conditions.push({
      name: 'Influenza',
      probability: 0.65,
      description: 'A contagious respiratory illness caused by influenza viruses'
    });
  }
  
  // Allergy symptoms
  if (symptoms.includes('Itching') || symptoms.includes('Rash') || symptoms.includes('Watery Eyes')) {
    conditions.push({
      name: 'Allergic Reaction',
      probability: 0.60,
      description: 'An immune system response to allergens'
    });
  }
  
  // Chest pain related
  if (symptoms.includes('Chest Pain')) {
    conditions.push({
      name: 'Angina',
      probability: 0.40,
      description: 'Chest pain caused by reduced blood flow to the heart'
    });
    conditions.push({
      name: 'Muscle Strain',
      probability: 0.35,
      description: 'Pain from strained muscles in the chest wall'
    });
    conditions.push({
      name: 'Gastroesophageal Reflux',
      probability: 0.30,
      description: 'Stomach acid flowing back into the esophagus causing pain'
    });
  }
  
  // If no specific conditions identified
  if (conditions.length === 0) {
    conditions.push({
      name: 'Non-specific condition',
      probability: 0.5,
      description: 'Based on the provided symptoms, no specific condition could be identified'
    });
  }
  
  // Generate recommendations based on urgency
  const recommendations: string[] = [];
  
  if (urgency === 'Emergency') {
    recommendations.push('Seek emergency medical attention immediately');
    recommendations.push('Call emergency services (911) or go to the nearest emergency room');
  } else if (urgency === 'High') {
    recommendations.push('Schedule an appointment with your doctor as soon as possible');
    recommendations.push('Monitor your symptoms closely and seek emergency care if they worsen');
  } else if (urgency === 'Medium') {
    recommendations.push('Schedule a routine appointment with your healthcare provider');
    recommendations.push('Rest and stay hydrated');
    recommendations.push('Take over-the-counter medications as appropriate for symptom relief');
  } else {
    recommendations.push('Rest and stay hydrated');
    recommendations.push('Monitor your symptoms for any changes');
    recommendations.push('Consider over-the-counter remedies for symptom relief');
  }
  
  return {
    possibleConditions: conditions,
    recommendations,
    urgencyLevel: urgency,
    followUpRecommended
  };
}
