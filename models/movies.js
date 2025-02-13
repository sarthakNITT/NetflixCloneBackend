const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  poster: { type: String, required: true, unique: true },
  trailer: { type: String, default: 'Thisisdefaultstring' }, // Optional field
  video: { type: String, default: 'Thisisdefaultstring' }, // Optional field
  rating: { type: Number, required: true },
  duration: { type: Number, default: 120 }, // Default value
  cast: { type: String, default: 'Thisisdefaultstring' }, // Optional field
  category: { type: String, required: true },
  isTrending: { type: Boolean, required: true },
  isTopRated: { type: Boolean, required: true },
});

module.exports = mongoose.model('Movies', moviesSchema);