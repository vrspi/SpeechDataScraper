const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1]; // Adjust depending on how the token is sent

    if (token == null) return res.sendStatus(401); // No token provided

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user;
        next();
    });
};
