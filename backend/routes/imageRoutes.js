const express = require('express');
const multer = require('multer');
const { checkExpiry } = require('../controllers/imageController');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/check-expiry', upload.single('image'), checkExpiry);

module.exports = router;
