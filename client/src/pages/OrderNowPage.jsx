import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/products';
import { addItemToCart } from '../api/cart'; // --- NEW IMPORT ---
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/auth/AuthModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

// This is a new, simplified page for the "Order Now" flow.
// It only asks for size and quantity.
const OrderNowPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Simplified customization state
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        // Set default size
        if (data.availableSizes.length > 0) {
          setSelectedSize(data.availableSizes[0]);
        }
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
    // This function builds the item for checkout,
    // assuming default color/fabric since the user wants the item "as is".
    return {
      productId: product._id,
      selectedSize: selectedSize,
      quantity: Number(quantity),
      price: product.basePrice,
      // Use the first available color and fabric as the default
      selectedColor: product.availableColors[0] || 'Default Color',
      selectedFabric: product.fabrics[0] || 'Default Fabric',
      // No print design or reference image for this flow
      printDesign: '',
      referenceImage: '', 
    };
  };

  const handleAuthCheck = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  // --- NEW FUNCTION ---
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
        <p>This is a "quick order" for the item as shown. For full customization, please use the "Customize" button.</p>
        <h3>${product.basePrice.toFixed(2)}</h3>

        <div className="form-group">
          <label>Size:</label>
          <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
            {product.availableSizes.map(size => <option key={size} value={size}>{size}</option>)}
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

        {/* --- WRAPPED BUTTONS IN A DIV --- */}
        <div style={{display: 'flex', gap: '10px', width: '100%'}}>
          <button 
            onClick={handleAddToCart} 
            style={{width: '50%', backgroundColor: '#28a745', color: 'white'}}
          >
            Add to Cart
          </button>
          <button 
            onClick={handleOrderNow} 
            style={{width: '50%', backgroundColor: '#007bff', color: 'white'}}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderNowPage;

