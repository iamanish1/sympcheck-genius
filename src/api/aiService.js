
import { pipeline } from '@huggingface/transformers';

// Cache for the AI models to avoid reloading them
const modelCache = {};

// Initialize models once and reuse them
export const getTextModel = async () => {
  if (!modelCache.textModel) {
    console.log('Initializing text analysis model...');
    try {
      modelCache.textModel = await pipeline(
        'text-classification',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        { quantized: true }
      );
      console.log('Text analysis model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize text analysis model:', error);
      throw error;
    }
  }
  return modelCache.textModel;
};

export const getImageModel = async () => {
  if (!modelCache.imageModel) {
    console.log('Initializing image analysis model...');
    try {
      modelCache.imageModel = await pipeline(
        'image-classification',
        'Xenova/vit-base-patch16-224', 
        { quantized: true }
      );
      console.log('Image analysis model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize image analysis model:', error);
      throw error;
    }
  }
  return modelCache.imageModel;
};

// Analyze text (for medical reports)
export const analyzeText = async (text) => {
  try {
    const model = await getTextModel();
    const result = await model(text);
    
    // Map the sentiment analysis to a medical context
    let medicalAnalysis = {
      type: 'document',
      abnormalValues: [],
      summary: ''
    };
    
    // Basic mapping of sentiment to medical context
    if (result[0].label === 'POSITIVE') {
      medicalAnalysis.summary = 'The report appears to have mostly normal values and positive indications.';
    } else {
      medicalAnalysis.summary = 'The report contains potential abnormalities that may require attention.';
      // Add a sample abnormal value
      medicalAnalysis.abnormalValues.push({
        test: 'General Assessment',
        value: 'Concerning indicators',
        normalRange: 'Normal indicators',
        interpretation: 'Potentially abnormal'
      });
    }
    
    return medicalAnalysis;
  } catch (error) {
    console.error('Text analysis error:', error);
    throw new Error('Failed to analyze text content');
  }
};

// Analyze image (for medical images)
export const analyzeImage = async (imageUrl) => {
  try {
    const model = await getImageModel();
    const result = await model(imageUrl);
    
    // Map the image classification to a medical context
    let medicalAnalysis = {
      type: 'image',
      findings: [],
      summary: ''
    };
    
    // Get the top classification
    const topResult = result[0];
    
    // Basic mapping of classification to medical context
    medicalAnalysis.findings.push({
      type: 'observation',
      location: 'detected region',
      description: `Detected pattern similar to ${topResult.label}`,
      confidence: topResult.score
    });
    
    // Add a recommendation based on confidence
    medicalAnalysis.findings.push({
      type: 'recommendation',
      description: topResult.score > 0.7 
        ? 'High confidence detection, may require attention'
        : 'Low confidence detection, additional review recommended'
    });
    
    medicalAnalysis.summary = `Image analysis detected patterns with ${Math.round(topResult.score * 100)}% confidence. ${
      topResult.score > 0.7 ? 'This may indicate a potential area of concern.' : 'The confidence level is low, suggesting a need for further review.'
    }`;
    
    return medicalAnalysis;
  } catch (error) {
    console.error('Image analysis error:', error);
    throw new Error('Failed to analyze image content');
  }
};

// Extract text from PDF using a simple OCR-like approach
export const extractTextFromPDF = async (pdfUrl) => {
  // This is a placeholder function
  // In a real implementation, you would use a PDF parsing library
  // For simplicity, we're returning placeholder text
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
  
  return "This is a simulated extraction of text from a PDF document. In a production environment, you would use a PDF parsing library to extract the actual text content.";
};

