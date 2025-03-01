const Progress = require('../models/progress');

exports.saveProgress = async (req, res) => {
  const { userId, movieId, progress } = req.body;

  try {
    // Validate input
    if (!userId || !movieId || progress === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if progress entry already exists
    let progressEntry = await Progress.findOne({ user: userId, movie: movieId });

    if (progressEntry) {
      // Update existing progress
      progressEntry.progress = progress;
      progressEntry.updatedAt = Date.now();
    } else {
      // Create new progress entry
      progressEntry = new Progress({ user: userId, movie: movieId, progress });
    }

    await progressEntry.save();

    res.status(200).json({ message: 'Progress saved successfully', progressEntry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.fetchProgress = async (req, res) => {
  const { userId, movieId } = req.query;

  try {
    // Validate input
    if (!userId || !movieId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find progress entry
    const progressEntry = await Progress.findOne({ user: userId, movie: movieId });

    if (!progressEntry) {
      return res.status(404).json({ message: 'No progress found for this movie' });
    }

    res.status(200).json({ message: 'Progress fetched successfully', progressEntry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};