const express = require('express');
const { getUploadSignature } = require('../controllers/upload.controller.js');
const isAuth = require('../middleware/isAuth.js');
const router = express.Router();

// We protect this route so only logged-in users can get a signature
// This corresponds to the /api/upload/sign call from the client
router.get('/sign', isAuth, getUploadSignature);

module.exports = router;
