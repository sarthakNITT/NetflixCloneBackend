const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Input validation function
const validateInput = (phoneNumber, email, password) => {
  const errors = [];
  if (!phoneNumber || !email || !password) {
    errors.push('All fields are required');
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }
  if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
    errors.push('Phone number must be 10 digits');
  }
  return errors;
};

// Register route
router.post('/register', async (req, res) => {
  const { phoneNumber, email, password } = req.body;

  const validationErrors = validateInput(phoneNumber, email, password);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const existingUserByPhone = await User.findOne({ phoneNumber });
    const existingUserByEmail = await User.findOne({ email });

    if (existingUserByPhone) {
      return res.status(400).json({ error: 'User with this phone number already exists' });
    }
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const user = new User({ phoneNumber, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.status(400).json({ error: 'Login ID and password are required' });
  }

  try {
    const loginIdString = loginId.toString();

    const user = await User.findOne({
      $or: [
        { phoneNumber: loginIdString },
        { email: loginIdString },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;