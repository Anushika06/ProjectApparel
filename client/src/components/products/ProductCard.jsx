import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Use a fallback image if imageUrls is empty
  const imageUrl = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls[0]
    : 'https://via.placeholder.com/300x250?text=No+Image';

  return (
    <div className="product-card">
      <img src={imageUrl} alt={product.name} />
      <div className="product-card-content">
        <h3>{product.name}</h3>
        <p>From ${product.basePrice.toFixed(2)}</p>
        <div className="card-buttons">
          <Link to={`/product/${product._id}`}>Customize</Link>
          {/* --- UPDATED THIS LINK --- */}
          <Link to={`/order-now/${product._id}`}>Order Now</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
