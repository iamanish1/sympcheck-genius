
import { API_BASE_URL } from './config';
import { analyzeText, analyzeImage, TextModelResult, ImageModelResult } from './aiService';

export interface ReportUploadResponse {
  message: string;
  report: {
    id: string;
    fileName: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
  };
}

export interface ReportAnalysis {
  report: {
    _id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    analysisResults: TextModelResult | ImageModelResult | null;
  };
}

export const uploadReport = async (file: File): Promise<ReportUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading to:', `${API_BASE_URL}/reports/upload`);
    
    const response = await fetch(`${API_BASE_URL}/reports/upload`, {
      method: 'POST',
      body: formData,
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Server responded with non-JSON content:', contentType);
      throw new Error(`Server responded with non-JSON content: ${contentType}`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error uploading report');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const getReportAnalysis = async (reportId: string): Promise<ReportAnalysis> => {
  try {
    console.log('Fetching report analysis for ID:', reportId);
    
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}`);
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Server responded with non-JSON content:', contentType);
      throw new Error(`Server responded with non-JSON content: ${contentType}`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error fetching report analysis');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Fetch analysis error:', error);
    throw error;
  }
};

// Process content with local AI models with retry mechanism and improved error handling
export const analyzeContentWithAI = async (content: string | File, contentType: string): Promise<TextModelResult | ImageModelResult> => {
  const MAX_RETRIES = 3;
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      console.log(`Processing content with local AI (attempt ${retries + 1}/${MAX_RETRIES}):`, contentType);
      
      if (contentType.includes('image')) {
        // For image content
        if (content instanceof File) {
          const imageUrl = URL.createObjectURL(content);
          try {
            const result = await analyzeImage(imageUrl);
            // Clean up the object URL after analysis
            URL.revokeObjectURL(imageUrl);
            return result;
          } catch (error) {
            URL.revokeObjectURL(imageUrl);
            throw error;
          }
        } else {
          throw new Error('Invalid image content type');
        }
      } else if (contentType.includes('pdf') || typeof content === 'string') {
        // For text/document content
        let textContent = '';
        
        if (content instanceof File && contentType.includes('pdf')) {
          // Here we would extract text from PDF
          // For now we'll use a placeholder
          textContent = "Extracted text from PDF document";
        } else if (typeof content === 'string') {
          textContent = content;
        }
        
        return await analyzeText(textContent);
      } else {
        throw new Error('Unsupported content type for analysis');
      }
    } catch (error) {
      retries++;
      console.error(`Local AI processing error (attempt ${retries}/${MAX_RETRIES}):`, error);
      
      if (retries >= MAX_RETRIES) {
        console.error('All retry attempts failed for AI processing');
        
        // Generate fallback response based on content type
        if (contentType.includes('image')) {
          return {
            type: 'image',
            findings: [
              {
                type: 'observation',
                description: 'Unable to analyze image with AI - please consult a healthcare professional',
                confidence: 0.99,
                severity: 'medium',
                suggestedAction: 'Share the original image with your healthcare provider'
              }
            ],
            summary: 'The image analysis was not successful with our AI models. For your safety, please share the original image with a qualified healthcare professional for proper interpretation.',
            healthScore: 50,
            recommendedActions: [
              {
                description: 'Consult with a healthcare provider',
                urgency: 'routine',
                rationale: 'For proper professional analysis of your medical image',
                confidence: 0.99
              }
            ]
          } as ImageModelResult;
        } else {
          return {
            type: 'document',
            abnormalValues: [],
            normalValues: [],
            summary: 'The document analysis was not successful with our AI models. For your safety, please share your medical report with a qualified healthcare professional for proper interpretation.',
            healthScore: 50,
            recommendedActions: [
              {
                description: 'Review with healthcare provider',
                urgency: 'routine',
                rationale: 'For proper professional analysis of your medical report',
                confidence: 0.99
              }
            ]
          } as TextModelResult;
        }
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
  
  // This should never be reached due to the error handling above
  throw new Error('Unexpected error in AI processing');
};
