
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  analysisResults: {
    type: Object,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', ReportSchema);
