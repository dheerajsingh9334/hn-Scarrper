require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { scrapeHackerNews } = require('./services/scraper');

const authRoutes = require('./routes/authRoutes');
const storyRoutes = require('./routes/storyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', storyRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Run scraper automatically on server start
  try {
    await scrapeHackerNews();
  } catch (err) {
    console.error('Initial scrape failed', err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
