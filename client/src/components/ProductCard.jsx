import React from 'react';

const ProductCard = ({ product }) => {
  // FIX: Add a guard clause to prevent crashes if the product prop is invalid.
  // If the product prop is missing or not an object, render nothing.
  if (!product || typeof product !== 'object') {
    return null;
  }

  // Use optional chaining for safer access to the image URL.
  const displayImage = product.imageUrls?.[0]
    ? product.imageUrls[0]
    : 'https://placehold.co/600x400?text=No+Image';

  return (
    // The main card container with a dark grey background and prominent border
    <div className="relative bg-zinc-700 rounded-2xl border-2 border-black shadow-2xl overflow-visible text-white font-sans">
      
      {/* Product Image - Positioned absolutely to "float" above the card */}
      <img
        src={displayImage}
        alt={product.name || 'Product Image'}
        className="absolute w-5/6 left-1/2 -translate-x-1/2 -top-20 filter drop-shadow-xl"
      />

      {/* Content container - Padded to make space for the floating image */}
      <div className="pt-48 p-6 text-center">
        
        {/* Product Name - Large, bold, with a custom text shadow */}
        <h2 
          className="text-4xl font-extrabold uppercase tracking-wide"
          style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.7)' }}
        >
          {product.name || 'Unnamed Product'}
        </h2>

        {/* Product Price */}
        <p 
          className="text-2xl mt-2 mb-6"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}
        >
          {/* FIX: Add a fallback for basePrice to prevent .toFixed() error */}
          Rs. {(product.basePrice || 0).toFixed(2)}/pc.
        </p>

        {/* Buttons Container */}
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

export default ProductCard;

