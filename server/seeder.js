const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product.js'); 

dotenv.config();


const sampleProducts = [
  {
    name: 'Corporate Polo',
    description: 'A professional classic-fit matte polo with an embroidered logo, perfect for corporate team wear',
    basePrice: 220.00,
    fabrics: ['Matte','Cotton/Poly Fleece', 'Lycra','Dot Net', 'Spun Matte'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Black', 'Charcoal', 'Maroon', 'Forest Green', 'Navy Blue'],
    imageUrls: ['http://localhost:3000/images/tshirt5.png'],
  },
  {
    name: 'Sports Dynamic Polo',
    description: 'A Dot Net moisture-wicking performance polo with a bold sublimated print and a logo',
    basePrice: 210.00,
    fabrics: ['Dot Net','Cotton/Poly Fleece', 'Lycra','Spun Matte', 'Matte'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Black', 'Charcoal', 'Maroon', 'Forest Green', 'Navy Blue'],
    imageUrls: ['http://localhost:3000/images/tshirt1.png'],
  },
  {
    name: 'Long-Sleeve Athletic Jersey',
    description: 'A long-sleeve Dot Net athletic jersey with a vibrant multi-color sublimated design and a logo',
    basePrice: 210.00,
    fabrics: ['Dot Net','Cotton/Poly Fleece', 'Lycra', 'Spun Matte', 'Matte'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Black', 'Charcoal', 'Maroon', 'Forest Green', 'Navy Blue'],
    imageUrls: ['http://localhost:3000/images/tshirt2.png'],
  },
  {
    name: 'School Uniform Polo Shirt',
    description: 'The official school uniform Spun Matte polo embroidered pocket crest.',
    basePrice: 150.00,
    fabrics: ['Spun Matte','Cotton/Poly Fleece', 'Lycra', 'Dot Net', 'Matte'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Black', 'Charcoal', 'Maroon', 'Forest Green', 'Navy Blue'],
    imageUrls: ['http://localhost:3000/images/tshirt4.png'],
  },
  {
    name: 'Kids Sports Uniform Set',
    description: 'A vibrant Spun Matte uniform set for kids designed for comfort and activity.',
    basePrice: 150.00,
    fabrics: ['Spun Matte','Cotton/Poly Fleece', 'Lycra', 'Dot Net', 'Matte'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Black', 'Charcoal', 'Maroon', 'Forest Green', 'Navy Blue'],
    imageUrls: ['http://localhost:3000/images/tshirt3.png'],
  },
  {
    name: 'Contrast Polo',
    description: 'A stylish Matte white polo with bold red contrast sleeves and collar, perfect for customizing with your own logo.',
    basePrice: 220.00,
    fabrics: ['Matte','Spun Matte','Cotton/Poly Fleece', 'Lycra', 'Dot Net'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Black', 'Charcoal', 'Maroon', 'Forest Green', 'Navy Blue'],
    imageUrls: ['http://localhost:3000/images/tshirt6.png'],
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.dbURL);
    console.log('MongoDB connected for seeding...');

    await Product.deleteMany(); 
    console.log('Existing products cleared.');

    await Product.insertMany(sampleProducts);
    console.log('Sample products have been imported!');
    
    process.exit();
  } catch (error) {
    console.error(`Error with seeder: ${error.message}`);
    process.exit(1);
  }
};


importData();