const express = require('express');
const router = express.Router();
const { register, login, checkAuth } = require('../controllers/auth');  // Imports logic
const { authenticate } = require('../middleware/auth.js');

// Routes
router.post('/register', register);  // POST /api/auth/register
router.post('/login', login);       // POST /api/auth/login
router.get('/check', authenticate, checkAuth);

module.exports = router;