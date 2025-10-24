const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product.js'); // Make sure the path is correct

dotenv.config();

// Sample data that matches your new Product schema
const sampleProducts = [
  {
    name: 'Corporate Polo',
    description: 'A professional classic-fit polo with an embroidered logo, perfect for corporate team wear',
    basePrice: 45.00,
    fabrics: ['Cotton/Poly Fleece', '100% Cotton French Terry'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Black', 'Charcoal', 'Maroon', 'Forest Green'],
    imageUrls: ['http://localhost:3000/images/tshirt3.png'],
  },
  {
    name: 'Sports Dynamic Performance Polo',
    description: 'A moisture-wicking performance polo with a bold sublimated print and a logo',
    basePrice: 45.00,
    fabrics: ['Cotton/Poly Fleece', '100% Cotton French Terry'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Black', 'Charcoal', 'Maroon', 'Forest Green'],
    imageUrls: ['http://localhost:3000/images/tshirt1.png'],
  },
  {
    name: 'Long-Sleeve Athletic Jersey',
    description: 'A long-sleeve athletic jersey with a vibrant multi-color sublimated design and a logo',
    basePrice: 45.00,
    fabrics: ['Cotton/Poly Fleece', '100% Cotton French Terry'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Black', 'Charcoal', 'Maroon', 'Forest Green'],
    imageUrls: ['http://localhost:3000/images/tshirt2.png'],
  },
  {
    name: 'School Uniform Polo Shirt',
    description: 'The official school uniform polo in signature yellow and navy with an embroidered pocket crest.',
    basePrice: 45.00,
    fabrics: ['Cotton/Poly Fleece', '100% Cotton French Terry'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Black', 'Charcoal', 'Maroon', 'Forest Green'],
    imageUrls: ['http://localhost:3000/images/tshirt4.png'],
  }
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