const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

// Add a movie to the watchlist
router.post('/add', watchlistController.addToWatchlist);

// Remove a movie from the watchlist
router.delete('/remove/:id', watchlistController.removeFromWatchlist);

// Fetch the user's watchlist
router.get('/:userId', watchlistController.getWatchlist);

module.exports = router;