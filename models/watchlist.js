const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  movie: {type: mongoose.Schema.Types.ObjectId, ref: 'Movies', required: true},
  addedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Watchlist', watchlistSchema);