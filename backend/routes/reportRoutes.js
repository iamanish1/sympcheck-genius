
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Report = require('../models/Report');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter for accepted file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/dicom', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, DICOM, and PDF are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB file size limit
  }
});

// Helper function for AI analysis
async function performAIAnalysis(filePath, fileType) {
  try {
    // For a real integration, you would connect to a machine learning API
    // or run local models here
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Return simulated AI analysis based on file type
    return simulateAIAnalysis(fileType);
  } catch (error) {
    console.error('AI Analysis error:', error);
    throw error;
  }
}

// Route to upload a report
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Create new report record in the database
    const newReport = new Report({
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileUrl: fileUrl
    });

    await newReport.save();
    
    // Start AI analysis process
    setTimeout(async () => {
      try {
        // Perform AI analysis on the file
        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        const analysisResults = await performAIAnalysis(filePath, req.file.mimetype);
        
        await Report.findByIdAndUpdate(newReport._id, {
          status: 'completed',
          analysisResults: analysisResults
        });
      } catch (error) {
        console.error('Error in analysis:', error);
        await Report.findByIdAndUpdate(newReport._id, { status: 'failed' });
      }
    }, 1000); // Short delay to start processing

    res.status(201).json({ 
      message: 'File uploaded successfully', 
      report: {
        id: newReport._id,
        fileName: newReport.fileName,
        status: newReport.status
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// Route to get analysis results by report ID
router.get('/:reportId', async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to simulate AI analysis based on file type
function simulateAIAnalysis(fileType) {
  if (fileType.includes('image')) {
    return {
      type: 'image',
      findings: [
        {
          type: 'observation',
          location: 'upper right quadrant',
          description: 'AI detected potential density variation',
          confidence: 0.87
        },
        {
          type: 'observation',
          location: 'lower left quadrant',
          description: 'Normal tissue appearance',
          confidence: 0.92
        },
        {
          type: 'recommendation',
          description: 'AI suggests consulting with a specialist for detailed examination of the upper right quadrant'
        }
      ],
      summary: 'AI image analysis detected potential areas of interest in the upper right quadrant with 87% confidence. The lower regions appear normal with high confidence. A specialist review is recommended for comprehensive evaluation.'
    };
  } else {
    return {
      type: 'document',
      abnormalValues: [
        {
          test: 'Hemoglobin',
          value: '11.2 g/dL',
          normalRange: '13.5-17.5 g/dL',
          interpretation: 'Below normal range (AI detected)'
        },
        {
          test: 'White Blood Cells',
          value: '11,500 /μL',
          normalRange: '4,500-11,000 /μL',
          interpretation: 'Above normal range (AI detected)'
        },
        {
          test: 'Platelet Count',
          value: '142,000 /μL',
          normalRange: '150,000-450,000 /μL',
          interpretation: 'Slightly below normal range (AI detected)'
        }
      ],
      summary: 'AI analysis of the document indicates potential anemia (low hemoglobin), elevated white blood cell count suggesting possible infection or inflammation, and slightly low platelet count which may warrant monitoring. The combined findings suggest follow-up with a healthcare provider.'
    };
  }
}

module.exports = router;
