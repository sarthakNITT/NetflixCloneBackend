require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const moviesController = require('../controllers/moviesController');
const Movies = require('../models/movies');

// Fetch movies from TMDB and store in the database
router.get('/fetchmovies', async (req, res) => {
  try {
    console.log('Fetching movies from TMDB...');
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`,
      { timeout: 10000 } // Add a timeout of 10 seconds
    );
    console.log('TMDB API response received:', response.data);
    const movies = response.data.results;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const movie of movies) {
      const newMovie = new Movies({
        title: movie.title,
        description: movie.overview,
        genre: movie.genre_ids.join(', '),
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
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
});

// Add a new movie
router.post('/', moviesController.addMovie);

// Get all movies
// router.get('/', moviesController.getAllMovies);

// Get a single movie by ID
router.get('/:id', moviesController.getMovieById);

// Update a movie
router.put('/:id', moviesController.updateMovie);

// Delete a movie
router.delete('/:id', moviesController.deleteMovie);

module.exports = router;