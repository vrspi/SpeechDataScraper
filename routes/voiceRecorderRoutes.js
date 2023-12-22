// voiceRecorderRoutes.js

const express = require('express');
const router = express.Router();
const voiceRecorderController = require('../controllers/voiceRecorderController');
const authController = require('../controllers/authController');

const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/', isAuthenticated, voiceRecorderController.index);
router.get('/login', (req, res) => {
    res.render('login/Index', { query: req.query }); // Pass query parameters to the view
});
router.post('/login', authController.loginUser);
// Add these routes for signup
router.get('/signup', (req, res) => {
    res.render('signup/Index', { error: null });
});

router.post('/signup', authController.signUpUser);

module.exports = router;
