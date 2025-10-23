const Cart = require('../models/cart.js');

// --- Helper Functions ---
// Finds a user's cart, or creates a new one if it doesn't exist
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [], totalAmount: 0 });
  }
  return cart;
};

// Recalculates the total price of the cart
const calculateTotal = (items) => {
  // Use item.price (set when added) and item.quantity
  return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};
// --- End Helper Functions ---


// GET /api/cart
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find cart and populate product details
    let cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      // If no cart, create an empty one
      cart = new Cart({ userId, items: [], totalAmount: 0 });
      await cart.save();
    }

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching cart.', error: error.message });
  }
};

// POST /api/cart/add
const addItemToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const newItem = req.body; // Contains productId, selectedSize, color, quantity, price

    const cart = await getOrCreateCart(userId);

    // Check if item with same configuration already exists
    const existingItemIndex = cart.items.findIndex(item =>
      item.productId.toString() === newItem.productId &&
      item.selectedSize === newItem.selectedSize &&
      item.selectedColor === newItem.selectedColor &&
      item.selectedFabric === newItem.selectedFabric
    );

    if (existingItemIndex > -1) {
      // Item exists - update quantity
      cart.items[existingItemIndex].quantity += newItem.quantity;
    } else {
      // Item is new - add to array
      cart.items.push(newItem);
    }

    // Recalculate total
    cart.totalAmount = calculateTotal(cart.items);

    await cart.save();
    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: 'Server error while adding to cart.', error: error.message });
  }
};

// PUT /api/cart/update/:itemId
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }

    const cart = await Cart.findOne({ userId });
    const itemToUpdate = cart.items.id(itemId); // Find the sub-document

    if (itemToUpdate) {
      itemToUpdate.quantity = quantity;
    } else {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();
    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: 'Server error while updating cart.', error: error.message });
  }
};

// DELETE /api/cart/remove/:itemId
const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId });

    cart.items.pull(itemId); // Mongoose helper to remove item from array

    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();
    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: 'Server error while removing from cart.', error: error.message });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem
};