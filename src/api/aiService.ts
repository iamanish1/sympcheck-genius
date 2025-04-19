
import { pipeline, PipelineType } from '@huggingface/transformers';
import { AI_CONFIG } from './config';

// Enhanced type definitions
interface AbnormalValue {
  test: string;
  value: string;
  normalRange: string;
  interpretation: string;
  severity: 'normal' | 'low' | 'high' | 'critical';
  confidence: number;
}

interface RecommendedAction {
  description: string;
  urgency: 'immediate' | 'soon' | 'routine' | 'monitoring';
  rationale: string;
  confidence: number;
}

export interface TextModelResult {
  type: 'document';
  abnormalValues: AbnormalValue[];
  normalValues: {
    test: string;
    value: string;
    normalRange: string;
    confidence: number;
  }[];
  summary: string;
  healthScore: number; // 0-100 scale
  recommendedActions: RecommendedAction[];
}

export interface Finding {
  type: 'observation' | 'recommendation';
  location?: string;
  description: string;
  confidence?: number;
  severity?: 'normal' | 'low' | 'medium' | 'high' | 'critical';
  suggestedAction?: string;
}

export interface ImageModelResult {
  type: 'image';
  findings: Finding[];
  summary: string;
  healthScore: number; // 0-100 scale
  recommendedActions: RecommendedAction[];
}

// Cache for the AI models to avoid reloading them
const modelCache: Record<string, any> = {};
let modelLoadAttempts: Record<string, number> = {};
const MAX_LOAD_ATTEMPTS = 3;

// Enhanced model loading with fallback mechanism
const loadModel = async (
  task: PipelineType, 
  modelName: string, 
  fallbackModelName: string
): Promise<any> => {
  try {
    console.log(`Initializing ${task} model with ${modelName}...`);
    const model = await pipeline(
      task,
      modelName,
      { device: 'webgpu' }
    );
    console.log(`${task} model initialized successfully`);
    return model;
  } catch (error) {
    console.warn(`Error loading model ${modelName}:`, error);
    
    if (!modelLoadAttempts[modelName]) {
      modelLoadAttempts[modelName] = 0;
    }
    
    modelLoadAttempts[modelName]++;
    
    if (modelLoadAttempts[modelName] <= MAX_LOAD_ATTEMPTS) {
      console.log(`Retrying model load attempt ${modelLoadAttempts[modelName]}/${MAX_LOAD_ATTEMPTS}`);
      return loadModel(task, modelName, fallbackModelName);
    }
    
    console.log(`Falling back to ${fallbackModelName}`);
    try {
      return await pipeline(
        task,
        fallbackModelName,
        { device: 'webgpu' }
      );
    } catch (fallbackError) {
      console.error(`Failed to load fallback model ${fallbackModelName}:`, fallbackError);
      throw new Error(`Failed to load both primary and fallback models for ${task}`);
    }
  }
};

// Initialize text model with fallback
export const getTextModel = async () => {
  if (!modelCache.textModel) {
    try {
      modelCache.textModel = await loadModel(
        'text-classification' as PipelineType,
        AI_CONFIG.models.reportText,
        AI_CONFIG.fallbackModels.reportText
      );
    } catch (error) {
      console.error('Failed to initialize text analysis model:', error);
      throw error;
    }
  }
  return modelCache.textModel;
};

// Initialize image model with fallback
export const getImageModel = async () => {
  if (!modelCache.imageModel) {
    try {
      modelCache.imageModel = await loadModel(
        'image-classification' as PipelineType,
        AI_CONFIG.models.reportImage,
        AI_CONFIG.fallbackModels.reportImage
      );
    } catch (error) {
      console.error('Failed to initialize image analysis model:', error);
      throw error;
    }
  }
  return modelCache.imageModel;
};

export const getSymptomModel = async () => {
  if (!modelCache.symptomModel) {
    try {
      modelCache.symptomModel = await loadModel(
        'text-classification' as PipelineType,
        AI_CONFIG.models.symptoms,
        AI_CONFIG.fallbackModels.symptoms
      );
    } catch (error) {
      console.error('Failed to initialize symptom analysis model:', error);
      throw error;
    }
  }
  return modelCache.symptomModel;
};

// Enhanced text analysis with more detailed results
export const analyzeText = async (text: string): Promise<TextModelResult> => {
  try {
    const model = await getTextModel();
    const result = await model(text);
    
    // Enhanced medical analysis with simulated detailed results
    const medicalAnalysis: TextModelResult = {
      type: 'document',
      abnormalValues: simulateAbnormalValues(),
      normalValues: simulateNormalValues(),
      summary: generateMedicalSummary(result),
      healthScore: calculateHealthScore(result),
      recommendedActions: generateRecommendedActions(result)
    };
    
    return medicalAnalysis;
  } catch (error) {
    console.error('Text analysis error:', error);
    
    // Return simulated fallback analysis if model fails
    return {
      type: 'document',
      abnormalValues: simulateAbnormalValues(true),
      normalValues: simulateNormalValues(true),
      summary: "Analysis couldn't be completed with AI, showing simulated results. We recommend consulting with a healthcare professional for accurate interpretation.",
      healthScore: 70,
      recommendedActions: [{
        description: "Consult with a healthcare provider for proper interpretation",
        urgency: "routine",
        rationale: "AI analysis incomplete",
        confidence: 0.99
      }]
    };
  }
};

// Enhanced image analysis with more detailed results
export const analyzeImage = async (imageUrl: string): Promise<ImageModelResult> => {
  try {
    const model = await getImageModel();
    const result = await model(imageUrl);
    
    // Enhanced medical image analysis
    const medicalAnalysis: ImageModelResult = {
      type: 'image',
      findings: generateDetailedFindings(result),
      summary: generateImageSummary(result),
      healthScore: calculateImageHealthScore(result),
      recommendedActions: generateImageRecommendations(result)
    };
    
    return medicalAnalysis;
  } catch (error) {
    console.error('Image analysis error:', error);
    
    // Return simulated fallback analysis if model fails
    return {
      type: 'image',
      findings: simulateFindings(),
      summary: "Image analysis couldn't be completed with AI, showing simulated results. We recommend consulting with a healthcare professional for accurate interpretation.",
      healthScore: 75,
      recommendedActions: [{
        description: "Consult with a radiologist for proper interpretation",
        urgency: "routine",
        rationale: "AI analysis incomplete",
        confidence: 0.99
      }]
    };
  }
};

// Helper functions for generating rich analysis results
function simulateAbnormalValues(isFallback = false): AbnormalValue[] {
  // This would be replaced with actual AI analysis in production
  return [
    {
      test: 'Hemoglobin',
      value: '11.2 g/dL',
      normalRange: '13.5-17.5 g/dL',
      interpretation: 'Below normal range - Possible mild anemia',
      severity: 'low',
      confidence: isFallback ? 0.8 : 0.96
    },
    {
      test: 'White Blood Cells',
      value: '11,500 /μL',
      normalRange: '4,500-11,000 /μL',
      interpretation: 'Above normal range - May indicate infection or inflammation',
      severity: 'high',
      confidence: isFallback ? 0.75 : 0.94
    },
    {
      test: 'Platelet Count',
      value: '142,000 /μL',
      normalRange: '150,000-450,000 /μL',
      interpretation: 'Slightly below normal range - May require monitoring',
      severity: 'low',
      confidence: isFallback ? 0.7 : 0.92
    }
  ];
}

function simulateNormalValues(isFallback = false): any[] {
  return [
    {
      test: 'Red Blood Cell Count',
      value: '5.1 million/μL',
      normalRange: '4.5-5.9 million/μL',
      confidence: isFallback ? 0.8 : 0.98
    },
    {
      test: 'Blood Glucose (Fasting)',
      value: '95 mg/dL',
      normalRange: '70-100 mg/dL',
      confidence: isFallback ? 0.75 : 0.99
    }
  ];
}

function generateMedicalSummary(result: any): string {
  // This would be replaced with actual NLP summary generation
  if (result[0].label === 'POSITIVE') {
    return 'Your report shows mostly normal values with a few items that may require attention. Your hemoglobin is slightly low which could indicate mild anemia, and your white blood cell count is elevated which may suggest your body is fighting an infection. Your platelet count is slightly below the normal range but may not be clinically significant. These findings suggest following up with your healthcare provider for further evaluation.';
  } else {
    return 'Your report contains some abnormal values that should be reviewed by a healthcare professional. Notably, your hemoglobin is below the normal range, suggesting possible anemia, and your white blood cell count is elevated, which can indicate infection or inflammation. Your platelet count is also slightly low. We recommend discussing these results with your doctor to determine if any action is needed.';
  }
}

function calculateHealthScore(result: any): number {
  // This would use actual AI inference to calculate a health score
  return result[0].label === 'POSITIVE' ? 85 : 70;
}

function generateRecommendedActions(result: any): RecommendedAction[] {
  // This would be based on actual AI analysis
  return [
    {
      description: "Follow up with your primary care physician",
      urgency: "soon",
      rationale: "To evaluate mild anemia and elevated white blood cell count",
      confidence: 0.94
    },
    {
      description: "Consider dietary changes to increase iron intake",
      urgency: "routine",
      rationale: "May help address low hemoglobin levels",
      confidence: 0.85
    },
    {
      description: "Monitor for symptoms like fatigue, weakness, or fever",
      urgency: "monitoring",
      rationale: "Could indicate worsening of underlying condition",
      confidence: 0.92
    }
  ];
}

function simulateFindings(): Finding[] {
  return [
    {
      type: 'observation',
      location: 'upper right quadrant',
      description: 'Potential density variation detected',
      confidence: 0.87,
      severity: 'medium',
      suggestedAction: 'Consult with a specialist for detailed examination'
    },
    {
      type: 'observation',
      location: 'lower left quadrant',
      description: 'Normal tissue appearance',
      confidence: 0.92,
      severity: 'normal',
      suggestedAction: 'No action needed'
    },
    {
      type: 'recommendation',
      description: 'Consider follow-up imaging in 6 months',
      confidence: 0.85,
      suggestedAction: 'Schedule follow-up appointment'
    }
  ];
}

function generateDetailedFindings(result: any): Finding[] {
  // This would use actual AI inference to generate findings
  const findings: Finding[] = [];
  
  // Convert model classification to findings
  for (const detection of result.slice(0, 3)) {
    findings.push({
      type: 'observation',
      description: `Detected pattern similar to ${detection.label}`,
      confidence: detection.score,
      severity: detection.score > 0.8 ? 'medium' : 'low',
      suggestedAction: detection.score > 0.8 
        ? 'Discuss with healthcare provider'
        : 'Monitor for changes'
    });
  }
  
  // Add recommendation
  findings.push({
    type: 'recommendation',
    description: 'Consider follow-up with a specialist',
    confidence: 0.9,
    suggestedAction: 'Schedule appointment with appropriate specialist'
  });
  
  return findings;
}

function generateImageSummary(result: any): string {
  // This would be based on actual AI analysis
  const topResult = result[0];
  const confidence = Math.round(topResult.score * 100);
  
  return `Image analysis detected patterns with ${confidence}% confidence. ${
    topResult.score > 0.7 
      ? 'This may indicate a potential area that requires professional review.' 
      : 'The confidence level is moderate, suggesting a need for further examination.'
  } We recommend discussing these results with your healthcare provider.`;
}

function calculateImageHealthScore(result: any): number {
  // This would use actual AI inference to calculate a health score
  const topClassification = result[0];
  return topClassification.score > 0.8 ? 75 : 85;
}

function generateImageRecommendations(result: any): RecommendedAction[] {
  // This would be based on actual AI analysis
  const topClassification = result[0];
  
  return [
    {
      description: "Consult with a specialist for detailed examination",
      urgency: topClassification.score > 0.8 ? "soon" : "routine",
      rationale: "To evaluate potential findings in the image",
      confidence: 0.9
    },
    {
      description: "Consider follow-up imaging in 3-6 months",
      urgency: "routine",
      rationale: "To monitor any changes over time",
      confidence: 0.85
    }
  ];
}

// Extract text from PDF using a simple OCR-like approach
export const extractTextFromPDF = async (pdfUrl: string): Promise<string> => {
  // This is a placeholder function
  // In a real implementation, you would use a PDF parsing library
  // For simplicity, we're returning placeholder text
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
  
  return "This is a simulated extraction of text from a PDF document. In a production environment, you would use a PDF parsing library to extract the actual text content.";
};
