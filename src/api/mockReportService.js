
// Mock implementation of the report API for development/testing

export const uploadReport = async (file) => {
  console.log('MOCK: Uploading file:', file.name);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a random ID
  const reportId = Math.random().toString(36).substring(2, 15);
  
  return {
    message: 'File uploaded successfully',
    report: {
      id: reportId,
      fileName: file.name,
      status: 'pending'
    }
  };
};

export const getReportAnalysis = async (reportId) => {
  console.log('MOCK: Getting analysis for report:', reportId);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Determine if the file is an image based on a randomly assigned type
  const isImage = Math.random() > 0.5;
  
  const report = {
    _id: reportId,
    fileName: `sample-${isImage ? 'xray' : 'bloodtest'}.${isImage ? 'png' : 'pdf'}`,
    fileType: isImage ? 'image/png' : 'application/pdf',
    fileSize: 1024 * 1024 * (1 + Math.random() * 5),
    status: 'completed',
    analysisResults: isImage ? 
      {
        type: 'image',
        findings: [
          {
            type: 'observation',
            location: 'upper right quadrant',
            description: 'Possible abnormality detected',
            confidence: 0.87
          },
          {
            type: 'recommendation',
            description: 'Consult with a specialist for further evaluation'
          }
        ],
        summary: 'Image analysis shows possible abnormalities that may require attention. The findings suggest consulting with a specialist for a detailed examination.'
      } :
      {
        type: 'document',
        abnormalValues: [
          {
            test: 'Hemoglobin',
            value: '11.2 g/dL',
            normalRange: '13.5-17.5 g/dL',
            interpretation: 'Below normal range'
          },
          {
            test: 'White Blood Cells',
            value: '11,500 /μL',
            normalRange: '4,500-11,000 /μL',
            interpretation: 'Above normal range'
          }
        ],
        summary: 'The report shows hemoglobin levels below the normal range and elevated white blood cell count, which may indicate anemia and a possible infection or inflammation.'
      }
  };
  
  return { report };
};
