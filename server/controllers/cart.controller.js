const Cart = require("../models/cart.js");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [], totalAmount: 0 });
  }
  return cart;
};

const calculateTotal = (items) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while fetching cart.",
        error: error.message,
      });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const newItem = req.body;

    const cart = await getOrCreateCart(userId);

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === newItem.productId &&
        item.selectedSize === newItem.selectedSize &&
        item.selectedColor === newItem.selectedColor &&
        item.selectedFabric === newItem.selectedFabric
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += newItem.quantity;
    } else {
      cart.items.push(newItem);
    }

    cart.totalAmount = calculateTotal(cart.items);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while adding to cart.",
        error: error.message,
      });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1." });
    }

    const cart = await Cart.findOne({ userId });
    const itemToUpdate = cart.items.id(itemId);

    if (itemToUpdate) {
      itemToUpdate.quantity = quantity;
    } else {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while updating cart.",
        error: error.message,
      });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId });

    cart.items.pull(itemId);

    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while removing from cart.",
        error: error.message,
      });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
};
