// app.js
const db = require('./module/db');
const multer = require('multer');
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const archiver = require('archiver');
const mysql = require('mysql');
const fs1 = require('fs');
const csv = require('csv-parser');
const cookieParser = require('cookie-parser');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Temporarily save files to 'uploads' directory
// In your routes file
app.use(cookieParser());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const voiceRecorderRoutes = require('./routes/voiceRecorderRoutes');
// MySQL connection (adjust with your settings)
const connection= mysql.createPool({
    connectionLimit: 10,
    host: '212.1.209.193',
    user: 'u669885128_Deb9t',
    database: 'u669885128_uZsNT',
    password: 'Loulouta159'
});
app.post('/submit-audio', upload.single('audio'), async (req, res) => {
    try {
        const text = req.body.text;
        const audioFilePath = req.file.path;

        // Read the audio file into a buffer
        const audioBuffer = await fs.readFile(audioFilePath);

        // Insert into the database
        const query = 'INSERT INTO audio_data (text, audio) VALUES (?, ?)';
        connection.query(query, [text, audioBuffer], (err, results) => {
            if (err){console.log(err)};
            
        });

      
        // Fetch a new random text from database
        const [rows] = await db.query("SELECT text FROM `1`");
        const randomText = rows[Math.floor(Math.random() * rows.length)].text;

        res.json({ randomText: randomText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
app.get('/select-all', (req, res) => {
    connection.query('SELECT id, audio FROM audio_data', async (err, results) => {
        if (err) {
            res.status(500).send('Error fetching data from database');
            return;
        }

        const tempDir = 'temp_audio/';
        if (!fs1.existsSync(tempDir)) {
            fs1.mkdirSync(tempDir);
        }
        for (let row of results) {
            const filePath = path.join(tempDir, `${row.id}.mp3`);
            fs1.writeFileSync(filePath, row.audio);
        }

        const zipPath = 'audio_files.zip';
        const output = fs1.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.pipe(output);
        archive.directory(tempDir, false);
        archive.finalize();

        output.on('close', () => {
            // Send the ZIP file
            res.download(zipPath, (downloadErr) => {
                if (downloadErr) {
                    console.error('Error sending file:', downloadErr);
                }

                // Clean up
                fs1.unlinkSync(zipPath);
                fs1.rmSync(tempDir, { recursive: true, force: true });
            });
        });
    });
});
app.get('/add-data', (req, res) => {
    const results = [];

    fs1.createReadStream('D:\\SpeechDataScraper\\public\\sentences.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data.darija))
        .on('end', () => {
            // Insert data into the database
            results.forEach(darijaText => {
                connection.query('INSERT INTO `1` (text) VALUES (?)', [darijaText], (err, result) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                        return;
                    }
                });
            });
            res.send('Data inserted successfully');
        });
});
// Use routes
app.use('/VoiceRecorder', voiceRecorderRoutes);
app.use('/', voiceRecorderRoutes);
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
