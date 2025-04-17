
// API configuration
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000/api'
  : '/api'; // Use relative path in production

export const AI_CONFIG = {
  useLocalModels: true, // Set to false to use remote API endpoints for AI processing
  modelCaching: true,   // Cache models in browser for better performance
  models: {
    // Use public models that don't require authentication
    medicine: 'Xenova/distilbert-base-uncased',
    reportText: 'Xenova/distilbert-base-uncased',
    reportImage: 'Xenova/vit-base-patch16-224',
    symptoms: 'Xenova/distilbert-base-uncased'
  }
};
