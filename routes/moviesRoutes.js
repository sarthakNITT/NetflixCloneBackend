require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const moviesController = require('../controllers/moviesController');
const Movies = require('../models/movies');

// Fetch movies from TMDB and store in the database
router.get('/fetchmovies', moviesController.fetchStore);

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