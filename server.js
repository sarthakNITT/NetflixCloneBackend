require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const moviesRouter = require('./routes/moviesRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const authMiddleware = require('./middleware/authMiddleware'); // Add authentication middleware

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Database connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', authMiddleware, moviesRouter); // Protect movies routes
app.use('/api/watchlist', authMiddleware, watchlistRoutes); // Protect watchlist routes

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});