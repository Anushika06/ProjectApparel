const Order = require("../models/order.js");
const Cart = require("../models/cart.js");
const Product = require("../models/product.js");
const User = require("../models/user.js");

const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const { items, totalAmount, deliveryAddress, phoneNumber, deliveryOption } =
      req.body;

    if (!items || items.length === 0 || !deliveryAddress || !phoneNumber) {
      return res.status(400).json({ message: "Missing order details." });
    }

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      deliveryAddress,
      phoneNumber,
      deliveryOption,
    });

    const savedOrder = await newOrder.save();

    await Cart.findOneAndUpdate(
      { userId: userId },
      { $set: { items: [], totalAmount: 0 } }
    );

    const user = await User.findById(userId).select("name");
    const customerName = user ? user.name : "Customer";

    let itemsString = "";

    for (const item of savedOrder.items) {
      const product = await Product.findById(item.productId).select("name");
      const productName = product ? product.name : "Product";

      itemsString += `
*Item:* ${productName}
*Size:* ${item.selectedSize || "N/A"}
*Color:* ${item.selectedColor || "N/A"}
*Fabric:* ${item.selectedFabric || "N/A"}
*Quantity:* ${item.quantity}
*Price:* ₹${item.price.toFixed(2)}
*Print Design:* ${item.printDesign || "None"}
*Reference Image:* ${item.referenceImage || "None"}
--------------------
`;
    }

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

    const whatsappNumber = process.env.WHATSAPP_NUMBER;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    res.status(201).json({ savedOrder, whatsappUrl });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while creating order.",
        error: error.message,
      });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId: userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while fetching orders.",
        error: error.message,
      });
  }
};

module.exports = { createOrder, getMyOrders };
