
import { pipeline } from '@huggingface/transformers';
import { API_BASE_URL, AI_CONFIG } from './config';

interface MedicineInfo {
  name: string;
  genericName: string;
  uses: string[];
  sideEffects: string[];
  dosage: string;
  interactions: string[];
  precautions: string[];
}

let medicalModel: any = null;

const initializeMedicalModel = async () => {
  if (!medicalModel) {
    console.log('Initializing medical analysis model...');
    try {
      medicalModel = await pipeline(
        'text-classification',
        AI_CONFIG.models.medicine,
        { device: 'webgpu' } // Changed from 'cpu' to 'webgpu'
      );
      console.log('Medical analysis model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize medical model:', error);
      throw error;
    }
  }
  return medicalModel;
};

export const analyzeMedicine = async (medicineName: string): Promise<MedicineInfo> => {
  try {
    const model = await initializeMedicalModel();
    
    // First, try to get data from an external API
    const apiResponse = await fetch(`${API_BASE_URL}/medicine/search?name=${encodeURIComponent(medicineName)}`);
    
    if (!apiResponse.ok) {
      console.log('API request failed, using AI model for analysis');
    }
    
    // Use AI model for analysis either way to enhance results
    const analysisPrompt = `Analyze the medicine: ${medicineName}. 
    Provide information about its uses, side effects, and precautions.`;
    
    const analysis = await model(analysisPrompt);
    console.log('AI analysis result:', analysis);
    
    // For demonstration, we'll use this mock data that would typically be generated
    // based on the AI model output in a production environment
    return {
      name: medicineName,
      genericName: medicineName.toLowerCase(),
      uses: ['Pain relief', 'Fever reduction'],
      sideEffects: ['Nausea', 'Dizziness'],
      dosage: 'Please consult your healthcare provider for proper dosage.',
      interactions: ['Consult healthcare provider for potential drug interactions'],
      precautions: ['Consult healthcare provider before use']
    };
  } catch (error) {
    console.error('Medicine analysis error:', error);
    throw error;
  }
};
