// middleware/isAuthenticated.js
const jwt = require('jsonwebtoken'); // Make sure you have jwt if you are using it
const jwtSecret = "VRSPIANAS16091999"; // Replace with a long, random string

function isAuthenticated(req, res, next) {
    if (req.cookies && req.cookies.jwt) {
        try {
            // Verify JWT token
            jwt.verify(req.cookies.jwt, jwtSecret);
            next();
        } catch (err) {
            // Handle token verification error
            res.redirect('/login');
        }
    } else {
        // No cookie found, redirect to login
        res.redirect('/login');
    }
}

module.exports = isAuthenticated;
