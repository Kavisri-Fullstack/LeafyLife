const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const dns = require('dns');
const plantRoutes = require('./routes/plantRoutes');
const authRoutes = require('./routes/authRoutes');
const protect = require('./middleware/authMiddleware');

dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Test route
app.get('/', (req, res) => {
  res.send('LeafyLife Backend Running!');
});

// Auth routes — public (no token needed)
app.use('/api/auth', authRoutes);

// Plant routes — protected (token required)
app.use('/api/plants', protect, plantRoutes);

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully!');
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database Connection Error:', err);
  });