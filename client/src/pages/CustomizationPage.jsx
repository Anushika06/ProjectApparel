import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../api/products';
import { addItemToCart } from '../api/cart';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/auth/AuthModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const CustomizationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Customization state
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedFabric, setSelectedFabric] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        // Set defaults from product model
        if (data.availableSizes.length > 0) setSelectedSize(data.availableSizes[0]);
        if (data.availableColors.length > 0) setSelectedColor(data.availableColors[0]);
        if (data.fabrics.length > 0) setSelectedFabric(data.fabrics[0]);
      } catch (error) {
        console.error("Failed to fetch product", error);
        toast.error('Product not found.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const getCustomizationDetails = () => {
    // This object matches the `cart.js` item schema
    return {
      productId: product._id,
      selectedSize,
      selectedColor,
      selectedFabric,
      quantity: Number(quantity),
      price: product.basePrice, // You can add more complex price logic here
      // Add other fields like printDesign if you have them
    };
  };

  const handleAuthCheck = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!handleAuthCheck()) return;

    try {
      const itemDetails = getCustomizationDetails();
      await addItemToCart(itemDetails);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add item. Please try again.');
    }
  };

  const handleOrderNow = () => {
    if (!handleAuthCheck()) return;

    const itemDetails = getCustomizationDetails();
    // Redirect to checkout, passing the single item in state
    navigate('/checkout', { state: { items: [itemDetails] } });
  };

  if (isLoading) return <LoadingSpinner />;
  if (!product) return <h2>Product not found.</h2>;

  return (
    <div className="customization-page">
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      
      <div className="customization-image">
        <img src={product.imageUrls[0]} alt={product.name} />
      </div>

      <div className="customization-options">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <h3>${product.basePrice.toFixed(2)}</h3>

        <div className="form-group">
          <label>Size:</label>
          <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
            {product.availableSizes.map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Color:</label>
          <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
            {product.availableColors.map(color => <option key={color} value={color}>{color}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Fabric:</label>
          <select value={selectedFabric} onChange={(e) => setSelectedFabric(e.target.value)}>
            {product.fabrics.map(fabric => <option key={fabric} value={fabric}>{fabric}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))} 
            min="1" 
          />
        </div>

        <p>
          Bulk order? <Link to="/contact">Contact for discount</Link>
        </p>

        <button onClick={handleAddToCart}>Add to Cart</button>
        <button onClick={handleOrderNow}>Order Now</button>
      </div>
    </div>
  );
};

export default CustomizationPage;