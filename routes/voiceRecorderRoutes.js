// voiceRecorderRoutes.js

const express = require('express');
const router = express.Router();
const voiceRecorderController = require('../controllers/voiceRecorderController');

router.get('/', voiceRecorderController.index);

module.exports = router;
