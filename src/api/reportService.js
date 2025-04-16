
import { API_BASE_URL } from './config';

export const uploadReport = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/reports/upload`, {
      method: 'POST',
      body: formData,
    });

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
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}`);

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
