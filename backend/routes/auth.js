const express = require('express');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { userValidation } = require('../middleware/validation');

const router = express.Router();

// POST /api/auth/register - Register new user
router.post('/register', userValidation.register, authController.register);

// POST /api/auth/login - Login user
router.post('/login', userValidation.login, authController.login);

// GET /api/auth/profile - Get user profile (protected)
router.get('/profile', auth, authController.getProfile);

// PUT /api/auth/profile - Update user profile (protected)
router.put('/profile', auth, authController.updateProfile);

module.exports = router; 