const Watchlist = require('../models/watchlist');

exports.addToWatchlist = async (req, res) => {
    const { userId, movieId } = req.body;
  
    try {
      const existingEntry = await Watchlist.findOne({ user: userId, movie: movieId });
      if (existingEntry) {
        return res.status(400).json({ message: 'Movie already in watchlist' });
      }
  
      const watchlistItem = new Watchlist({ user: userId, movie: movieId });
      await watchlistItem.save();
  
      res.status(201).json({ message: 'Movie added to watchlist', watchlistItem });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
};

exports.removeFromWatchlist = async (req, res) => {
    const { id } = req.params;
  
    try {
      const watchlistItem = await Watchlist.findByIdAndDelete(id);
      if (!watchlistItem) {
        return res.status(404).json({ message: 'Watchlist item not found' });
      }
  
      res.status(200).json({ message: 'Movie removed from watchlist', watchlistItem });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
};

exports.getWatchlist = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const watchlist = await Watchlist.find({ user: userId }).populate('movie');
      res.status(200).json(watchlist);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
};