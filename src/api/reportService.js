
import { API_BASE_URL } from './config';

export const uploadReport = async (file) => {
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
      throw new Error(`Server responded with non-JSON content: ${contentType}`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error uploading report');
    }

    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const getReportAnalysis = async (reportId) => {
  try {
    console.log('Fetching report analysis for ID:', reportId);
    
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}`);
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Server responded with non-JSON content: ${contentType}`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error fetching report analysis');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch analysis error:', error);
    throw error;
  }
};
