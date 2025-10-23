const express = require('express');
const { 
  getCart, 
  addItemToCart, 
  updateCartItem, 
  removeCartItem 
} = require('../controllers/cart.controller.js');
const isAuth = require('../middleware/isAuth.js'); // Import auth middleware
const router = express.Router();

// All cart routes are protected
router.get('/', isAuth, getCart);
router.post('/add', isAuth, addItemToCart);
router.put('/update/:itemId', isAuth, updateCartItem);
router.delete('/remove/:itemId', isAuth, removeCartItem);

module.exports = router;