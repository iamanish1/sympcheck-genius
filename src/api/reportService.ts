
import { API_BASE_URL } from './config';
import { analyzeText, analyzeImage } from './aiService';

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
    analysisResults: any;
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

// Process content with local AI models
export const analyzeContentWithAI = async (content: string | File, contentType: string): Promise<any> => {
  try {
    console.log('Processing content with local AI:', contentType);
    
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
    console.error('Local AI processing error:', error);
    throw error;
  }
};
