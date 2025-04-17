
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
let modelInitializationAttempted = false;

const initializeMedicalModel = async () => {
  if (!medicalModel && !modelInitializationAttempted) {
    modelInitializationAttempted = true;
    console.log('Initializing medical analysis model...');
    try {
      const { pipeline } = await import('@huggingface/transformers');
      medicalModel = await pipeline(
        'text-classification',
        AI_CONFIG.models.medicine,
        { device: 'webgpu' }
      );
      console.log('Medical analysis model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize medical model:', error);
      // We don't throw here, just log the error
    }
  }
  return medicalModel;
};

export const analyzeMedicine = async (medicineName: string): Promise<MedicineInfo> => {
  try {
    // Try to initialize the model, but don't wait for it to succeed
    initializeMedicalModel().catch(console.error);
    
    // First, try to get data from an external API
    try {
      const apiResponse = await fetch(`${API_BASE_URL}/medicine/search?name=${encodeURIComponent(medicineName)}`);
      
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        console.log('API data received for medicine:', apiData);
        // If we have API data, return it
        if (apiData && apiData.name) {
          return apiData;
        }
      }
    } catch (apiError) {
      console.log('API request failed:', apiError);
    }
    
    // If model is available, try to use it
    if (medicalModel) {
      const analysisPrompt = `Analyze the medicine: ${medicineName}. 
      Provide information about its uses, side effects, and precautions.`;
      
      try {
        const analysis = await medicalModel(analysisPrompt);
        console.log('AI analysis result:', analysis);
      } catch (modelError) {
        console.error('Model analysis failed:', modelError);
      }
    }
    
    // Return mock data (this would be either enhanced by AI or completely from API in production)
    let mockMedicineData = getMockMedicineData(medicineName);
    
    return mockMedicineData;
  } catch (error) {
    console.error('Medicine analysis error:', error);
    // Return a fallback response even if everything fails
    return getMockMedicineData(medicineName);
  }
};

// Helper function to get mock medicine data
const getMockMedicineData = (medicineName: string): MedicineInfo => {
  // Basic data for common medicines
  const commonMedicines: Record<string, Partial<MedicineInfo>> = {
    ibuprofen: {
      genericName: "Ibuprofen",
      uses: ['Pain relief', 'Fever reduction', 'Inflammation reduction'],
      sideEffects: ['Upset stomach', 'Heartburn', 'Dizziness', 'Mild headache'],
      dosage: 'Adults: 200-400mg every 4-6 hours as needed, not exceeding 1200mg per day.',
      interactions: ['Blood thinners', 'Aspirin', 'Some blood pressure medications'],
      precautions: ['Avoid if you have stomach ulcers', 'Use caution if you have heart conditions']
    },
    paracetamol: {
      genericName: "Acetaminophen",
      uses: ['Pain relief', 'Fever reduction'],
      sideEffects: ['Rare allergic reactions', 'Liver damage (at high doses)'],
      dosage: 'Adults: 500-1000mg every 4-6 hours, not exceeding 4000mg per day.',
      interactions: ['Alcohol', 'Other medications containing acetaminophen'],
      precautions: ['Avoid alcohol consumption', 'Do not exceed recommended dose']
    },
    aspirin: {
      genericName: "Acetylsalicylic acid",
      uses: ['Pain relief', 'Fever reduction', 'Blood thinning', 'Anti-inflammatory'],
      sideEffects: ['Upset stomach', 'Heartburn', 'Increased bleeding risk'],
      dosage: 'Adults: 300-600mg every 4-6 hours as needed.',
      interactions: ['Blood thinners', 'Ibuprofen', 'Some antidepressants'],
      precautions: ['Not recommended for children under 16', 'Avoid if you have bleeding disorders']
    }
  };

  const normalizedName = medicineName.toLowerCase();
  const medicineData = commonMedicines[normalizedName] || {};
  
  return {
    name: medicineName,
    genericName: medicineData.genericName || medicineName,
    uses: medicineData.uses || ['Consult healthcare provider for specific uses'],
    sideEffects: medicineData.sideEffects || ['Consult healthcare provider for side effect information'],
    dosage: medicineData.dosage || 'Please consult your healthcare provider for proper dosage.',
    interactions: medicineData.interactions || ['Consult healthcare provider for potential drug interactions'],
    precautions: medicineData.precautions || ['Consult healthcare provider before use']
  };
};
