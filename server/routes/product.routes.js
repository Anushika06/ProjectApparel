const express = require('express');
// UPDATE THIS LINE
const { getProducts, getProductById } = require('../controllers/productController.js');

const router = express.Router();

router.get('/', getProducts);
// ADD THIS NEW LINE
router.get('/:id', getProductById);

module.exports = router;