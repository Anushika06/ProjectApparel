const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            selectedColor: String,
            selectedSize: String,
            selectedFabric: String,
            printDesign: String,
            referenceImage: String,
            quantity: Number,
            price: Number
        }
    ],
    totalAmount: Number,
    deliveryOption: String,
    deliveryAddress: String,
    phoneNumber: String,                   
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
