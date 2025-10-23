const express = require('express');
const { createOrder, getMyOrders } = require('../controllers/order.controller.js');
const isAuth = require('../middleware/isAuth.js'); // Import auth middleware
const router = express.Router();

// All order routes are protected
router.post('/create', isAuth, createOrder);
router.get('/my', isAuth, getMyOrders);

module.exports = router;