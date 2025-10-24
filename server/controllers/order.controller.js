const Order = require('../models/order.js');
const Cart = require('../models/cart.js');
const Product = require('../models/product.js'); // Import Product model
const User = require('../models/user.js'); // Import User model

// POST /api/orders/create
// Protected by isAuth middleware
const createOrder = async (req, res) => {
  try {
    // 1. Get User ID (from isAuth)
    const userId = req.user._id;

    // 2. Get Checkout Data
    const { items, totalAmount, deliveryAddress, phoneNumber, deliveryOption } = req.body;

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
      deliveryOption,
    });

    // 4. Save
    const savedOrder = await newOrder.save();

    // 5. Clear Cart after successful order
    await Cart.findOneAndUpdate(
      { userId: userId },
      { $set: { items: [], totalAmount: 0 } }
    );

    // 6. --- Build WhatsApp Message ---
    
    // A. Get user's name
    const user = await User.findById(userId).select('name');
    const customerName = user ? user.name : 'Customer';

    // B. Build item details string
    let itemsString = '';
    // We loop through the items *in the saved order* to get their details
    for (const item of savedOrder.items) {
      // Find the product name from the Product model
      const product = await Product.findById(item.productId).select('name');
      const productName = product ? product.name : 'Product';

      itemsString += `
*Item:* ${productName}
*Size:* ${item.selectedSize || 'N/A'}
*Color:* ${item.selectedColor || 'N/A'}
*Fabric:* ${item.selectedFabric || 'N/A'}
*Quantity:* ${item.quantity}
*Price:* ₹${item.price.toFixed(2)}
*Print Design:* ${item.printDesign || 'None'}
*Reference Image:* ${item.referenceImage || 'None'}
--------------------
`;
    }

    // C. Create final message
    const message = `
* New Order Received! *

*Customer Name:* ${customerName}
*Customer Phone:* ${phoneNumber}

*Order Details (ID: ${savedOrder._id}):*
${itemsString}
*Delivery Option:* ${deliveryOption}
*Delivery Address:* ${deliveryAddress}

*TOTAL AMOUNT: ₹${totalAmount.toFixed(2)}*
`;

    // D. Create URL
    const whatsappNumber = process.env.WHATSAPP_NUMBER;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // 7. Respond with the URL
    // The client (CheckoutPage.jsx) is expecting this object
    res.status(201).json({ savedOrder, whatsappUrl });

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

