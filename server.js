// app.js
const db = require('./module/db');

const express = require('express');
const path = require('path');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const voiceRecorderRoutes = require('./routes/voiceRecorderRoutes');

app.post('/submit-audio', async (req, res) => {
    try {
       
        const [rows] = await db.query("SELECT text FROM `1`");
        const randomText = rows[Math.floor(Math.random() * rows.length)].text;

        // Respond with the new text
        res.json({ randomText: randomText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Use routes
app.use('/VoiceRecorder', voiceRecorderRoutes);
app.get('/privacy-policy', (req, res) => {
    res.render('pages/privacy-policy'); // Your EJS file for the privacy policy
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    res.status(404).render('error', { title: '404: File Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { title: '500: Internal Server Error' });
});

// Set the server to listen on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
