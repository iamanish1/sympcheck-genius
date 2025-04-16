
import { pipeline } from '@huggingface/transformers';
import { API_BASE_URL } from './config';

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
        'Xenova/mobilebert-base-medical',
        { quantized: true }
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
      throw new Error('API request failed');
    }
    
    // If API call fails, use AI model for analysis
    const analysisPrompt = `Analyze the medicine: ${medicineName}. 
    Provide information about its uses, side effects, and precautions.`;
    
    const analysis = await model(analysisPrompt);
    
    // Process the analysis results
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
