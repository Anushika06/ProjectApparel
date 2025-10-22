const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    description: {
      type: String,
      required: true,
    },
    basePrice: { 
      type: Number, 
      required: true 
    },
    fabrics: { 
      type: [String],
      required: true,
      default: [],
    },
    availableSizes: { 
      type: [String], 
      required: true,
      default: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    availableColors: {
      type: [String],
      required: true,
      default: [],
    },
    imageUrls: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
