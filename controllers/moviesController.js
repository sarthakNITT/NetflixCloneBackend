const Movies = require('../models/movies');
const axios = require('axios')
require('dotenv').config()

// Fetch movies from TMDB and store in the database
const fetchStore = async (req, res) => {
  console.log(process.env.API_KEY);
  try {
    console.log('Fetching movies from TMDB...');
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`,
      { timeout: 40000 } // Add a timeout of 10 seconds
    );
    console.log('TMDB API response received:', response.data);
    const movies = response.data.results;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const movie of movies) {
      const newMovie = new Movies({
        title: movie.title,
        description: movie.overview,
        genre: movie.genre_ids.join(', '),
        type: 'movie', // Providing a default type value
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        thumbnail: `https://image.tmdb.org/t/p/w500${movie.poster_path}`, // Changed from 'poster' to 'thumbnail'
        tmdbID: movie.id.toString(), // Added the TMDB ID (convert to string if necessary)
        language: movie.original_language, // Added language field
        trailer: '',
        video: '',
        rating: movie.vote_average,
        duration: 120,
        cast: '',
        category: 'Movie',
        isTrending: movie.popularity > 50,
        isTopRated: movie.vote_average > 7.5,
      });
      await newMovie.save();
      await delay(1000); // Add a 1-second delay between requests
    }

    res.status(200).json({ message: 'Movies fetched and stored successfully' });
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    console.error('Error details:', error.response ? error.response.data : error);
    res.status(500).json({ message: 'Failed to fetch and store movies' });
  }
};

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

module.exports = { fetchStore ,addMovie, getAllMovies, getMovieById, updateMovie, deleteMovie };