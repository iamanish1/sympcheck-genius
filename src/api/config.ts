
// API configuration
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000/api'
  : '/api'; // Use relative path in production

export const AI_CONFIG = {
  useLocalModels: true, // Set to false to use remote API endpoints for AI processing
  modelCaching: true,   // Cache models in browser for better performance
  models: {
    // Use optimized medical-specific models with higher accuracy
    medicine: 'Xenova/bert-base-healthcare',
    reportText: 'Xenova/biobert-base-cased-v1.2',
    reportImage: 'Xenova/vit-base-medical',
    symptoms: 'Xenova/biobert-base-cased-v1.2'
  },
  processing: {
    batchSize: 4,       // Process multiple elements in parallel for speed
    confidence: 0.95,   // Higher confidence threshold for more accurate results
    timeout: 30000      // Timeout in milliseconds for model processing
  },
  fallbackModels: {
    // Fallback to these models if primary ones fail
    reportText: 'Xenova/distilbert-base-uncased',
    reportImage: 'Xenova/vit-base-patch16-224',
    medicine: 'Xenova/distilbert-base-uncased',
    symptoms: 'Xenova/distilbert-base-uncased'
  }
};
