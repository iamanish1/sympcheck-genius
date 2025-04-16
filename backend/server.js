const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const userRoutes = require('./routes/userRoutes');
const checkupRoutes = require('./routes/checkupRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/checkup', checkupRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api/reports', reportRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('MedGenius API is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medgenius', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
