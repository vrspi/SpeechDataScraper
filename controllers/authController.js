const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../module/db'); // Adjust the path as per your project structure
const jwtSecret = "VRSPIANAS16091999"; // Replace with a long, random string


const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const [users] = await db.query('SELECT * FROM AIusers WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.redirect('/login?error=invalid');
        }

        const user = users[0];

        // Check if password is correct
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.redirect('/login?error=invalid');
        }

        // Create JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '31d' });

        // Set cookie with JWT
        res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 * 31 });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Define the salt rounds for bcrypt
const saltRounds = 10; // You can adjust this value based on your security requirements

// Function to handle the signup process
const signUpUser = async (req, res) => {
    const { username, password } = req.body;

    try {

        const userExists = await db.query('SELECT * FROM AIusers WHERE username = ?', [username]);
        if (userExists[0].length > 0) {
            // Username already exists, return to sign-up page with an error message
            return res.render('signup/Index', { 
                error: 'Username already exists', 
                username: username // Optionally pre-fill the username field
            });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into database
        await db.query('INSERT INTO AIusers (username, password) VALUES (?, ?)', [username, hashedPassword]);

        // Generate JWT for the new user
        const token = jwt.sign({ username }, jwtSecret, { expiresIn: '24h' }); // Use jwtSecret here

        // Set JWT as a cookie
        res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });

        // Redirect to the home route
        res.redirect('/');
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).send('Error during signup');
    }
};

module.exports = {
    loginUser,
    signUpUser
};
