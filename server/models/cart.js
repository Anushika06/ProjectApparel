const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        selectedColor: String,
        selectedSize: String,
        selectedFabric: String,
        printDesign: String,
        referenceImage: String,
        quantity: { type: Number, default: 1 },
        expectedDays: Number,
        deliveryOption: String,
        deliveryAddress: String,
        price: Number,
      },
    ],
    totalAmount: Number,
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
