require('dotenv').config();
const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Save progress
router.post('/check', progressController.saveProgress);

// Fetch progress
router.get('/check', progressController.fetchProgress);

module.exports = router;