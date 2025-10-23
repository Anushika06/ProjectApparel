const express = require('express');
const { submitEnquiry } = require('../controllers/enquiry.controller.js');
const router = express.Router();

// POST /api/enquiry
router.post('/', submitEnquiry);

module.exports = router;