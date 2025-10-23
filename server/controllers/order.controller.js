const Order = require('../models/order.js');
const Cart = require('../models/cart.js'); // We need this to clear the cart

// POST /api/orders/create
// Protected by isAuth middleware
const createOrder = async (req, res) => {
  try {
    // 1. Get User ID (from isAuth)
    const userId = req.user._id;

    // 2. Get Checkout Data
    const { items, totalAmount, deliveryAddress, phoneNumber } = req.body;

    if (!items || items.length === 0 || !deliveryAddress || !phoneNumber) {
      return res.status(400).json({ message: 'Missing order details.' });
    }

    // 3. Create
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      deliveryAddress,
      phoneNumber,
      // Add other fields from order.js model if needed
    });

    // 4. Save
    const savedOrder = await newOrder.save();

    // 5. Clear Cart after successful order
    await Cart.findOneAndUpdate(
      { userId: userId },
      { $set: { items: [], totalAmount: 0 } }
    );

    // 6. Respond
    res.status(201).json(savedOrder);

  } catch (error) {
    res.status(500).json({ message: 'Server error while creating order.', error: error.message });
  }
};

// GET /api/orders/my
// Protected by isAuth middleware
const getMyOrders = async (req, res) => {
  try {
    // 1. Get User ID (from isAuth)
    const userId = req.user._id;

    // 2. Find Orders for this user
    const orders = await Order.find({ userId: userId })
      .populate('items.productId') // 3. CRITICAL: Populate product details
      .sort({ createdAt: -1 }); // Show newest orders first

    // 4. Respond
    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching orders.', error: error.message });
  }
};

module.exports = { createOrder, getMyOrders };