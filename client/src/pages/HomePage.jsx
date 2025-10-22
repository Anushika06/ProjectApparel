import React from 'react';

// --- FIX: The ProductCard component is now defined directly in this file ---
// This resolves the error about being unable to find the component file.
const ProductCard = ({ product }) => {
  // Add a guard clause to prevent crashes if the product prop is invalid.
  if (!product || typeof product !== 'object') {
    return null;
  }

  // Use optional chaining for safer access to the image URL.
  const displayImage = product.imageUrls?.[0]
    ? product.imageUrls[0]
    : 'https://placehold.co/600x400?text=No+Image';

  return (
    <div className="relative bg-zinc-700 rounded-2xl border-2 border-black shadow-2xl overflow-visible text-white font-sans">
      <img
        src={displayImage}
        alt={product.name || 'Product Image'}
        className="absolute w-5/6 left-1/2 -translate-x-1/2 -top-20 filter drop-shadow-xl"
      />
      <div className="pt-48 p-6 text-center">
        <h2 
          className="text-4xl font-extrabold uppercase tracking-wide"
          style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.7)' }}
        >
          {product.name || 'Unnamed Product'}
        </h2>
        <p 
          className="text-2xl mt-2 mb-6"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}
        >
          Rs. {(product.basePrice || 0).toFixed(2)}/pc.
        </p>
        <div className="flex flex-col gap-3">
          <button className="w-full bg-[#4a2e1a] hover:bg-[#3b2515] text-white font-bold text-lg py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
            ORDER NOW
          </button>
          <button className="w-full bg-white hover:bg-gray-200 text-black font-bold text-lg py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
            CUSTOMIZE
          </button>
        </div>
      </div>
    </div>
  );
};


// Sample data that matches your Product model structure
const sampleProduct = {
  _id: '1',
  name: 'Round Neck T-Shirt',
  basePrice: 120.00,
  imageUrls: ['http://localhost:3000/images/tshirt.png'], // Make sure this path is correct
};

const sampleProduct2 = {
    _id: '2',
    name: 'Pullover Hoodie',
    basePrice: 350.00,
    imageUrls: ['http://localhost:3000/images/hoodie.png'], // Add a hoodie image to your public folder
};


const HomePage = () => {
  return (
    // Main container with the light cream background from your image
    <div className="min-h-screen bg-[#f5f3e7] p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-24 text-zinc-800">Our Products</h1>
        
        {/* Grid layout for the product cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-28">
          {/* We add extra vertical gap (gap-y-28) to give the floating images space */}
          <ProductCard product={sampleProduct} />
          <ProductCard product={sampleProduct2} />
          <ProductCard product={sampleProduct} /> 
        </div>
      </div>
    </div>
  );
};

export default HomePage;

