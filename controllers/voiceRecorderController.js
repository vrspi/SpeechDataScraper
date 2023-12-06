const index = (req, res) => {
    res.render('voiceRecorder/index', { title: 'Voice Recorder' });  // Pass any dynamic data to your EJS template as needed
};

module.exports = {
    index
};