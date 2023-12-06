const db = require('./db');
const db = require('../module/db');
const index = (req, res) => {
    try {
        const [rows] = await db.query("SELECT text FROM yourTable");
        const randomText = rows[Math.floor(Math.random() * rows.length)].text;
        res.render('voiceRecorder/index', { title: 'Voice Recorder' ,randomText: randomText});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

module.exports = {
    index
};