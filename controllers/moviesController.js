const Movies = require('../models/movies');

// Add a new movie
const addMovie = async (req, res) => {
  try {
    const newMovie = new Movies(req.body);
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ message: `Error adding movie: ${error.message}` });
  }
};

// Get all movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movies.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: `Error fetching movies: ${error.message}` });
  }
};

// Get a single movie by ID
const getMovieById = async (req, res) => {
  try {
    const movie = await Movies.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: `Error fetching movie: ${error.message}` });
  }
};

// Update a movie
const updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movies.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: `Error updating movie: ${error.message}` });
  }
};

// Delete a movie
const deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movies.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error deleting movie: ${error.message}` });
  }
};

module.exports = { addMovie, getAllMovies, getMovieById, updateMovie, deleteMovie };