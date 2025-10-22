const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product.js'); // Make sure the path is correct

dotenv.config();

// Sample data that matches your new Product schema
const sampleProducts = [
  {
    name: 'Classic Crew Neck T-Shirt',
    description: 'A timeless and comfortable t-shirt, perfect for any brand. Made from 100% premium combed cotton.',
    basePrice: 15.50,
    fabrics: ['100% Cotton', 'Polyester Blend', 'Tri-Blend'],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: ['Black', 'White', 'Navy Blue', 'Heather Grey'],
    imageUrls: ['http://localhost:3000/images/tshirt.png'], // Using the static path we discussed
  },
  {
    name: 'Premium Pullover Hoodie',
    description: 'A cozy and stylish hoodie made from high-quality fleece, ideal for colder weather.',
    basePrice: 45.00,
    fabrics: ['Cotton/Poly Fleece', '100% Cotton French Terry'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Black', 'Charcoal', 'Maroon', 'Forest Green'],
    imageUrls: ['http://localhost:3000/images/hoodie.png'],
  },
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.dbURL);
    console.log('MongoDB connected for seeding...');

    await Product.deleteMany(); // Clear out old products
    console.log('Existing products cleared.');

    await Product.insertMany(sampleProducts);
    console.log('Sample products have been imported!');
    
    process.exit();
  } catch (error) {
    console.error(`Error with seeder: ${error.message}`);
    process.exit(1);
  }
};

// This allows the script to be run directly from the command line
importData();