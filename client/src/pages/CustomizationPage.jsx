import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../api/products';
import { addItemToCart } from '../api/cart';
import { getSignature, uploadImage } from '../api/upload'; // NEW IMPORT
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
  const [isUploading, setIsUploading] = useState(false); // NEW STATE for upload status
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Customization state
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedFabric, setSelectedFabric] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [printDesign, setPrintDesign] = useState('');
  
  // --- MODIFIED THIS ---
  const [imageFile, setImageFile] = useState(null); // To hold the file object

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await getProductById(id);
        setProduct(data);
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

  // --- NEW FUNCTION ---
  // Handles uploading the image to Cloudinary if one is selected
  const handleImageUpload = async () => {
    if (!imageFile) {
      return ''; // No file selected, return empty string for the URL
    }

    setIsUploading(true);
    toast.loading('Uploading image...');
    
    try {
      // 1. Get signature from our backend
      const { signature, timestamp } = await getSignature();
      
      // 2. Upload file to Cloudinary
      const uploadData = await uploadImage(imageFile, signature, timestamp);
      
      toast.dismiss();
      toast.success('Image uploaded!');
      setIsUploading(false);
      return uploadData.secure_url; // Return the new Cloudinary URL
      
    } catch (error) {
      toast.dismiss();
      toast.error('Image upload failed. Please try again.');
      setIsUploading(false);
      return 'error'; // Return an error flag
    }
  };

  // --- MODIFIED THIS FUNCTION ---
  // Now accepts the uploaded URL
  const getCustomizationDetails = (uploadedUrl) => {
    return {
      productId: product._id,
      selectedSize,
      selectedColor,
      selectedFabric,
      quantity: Number(quantity),
      price: product.basePrice,
      printDesign,
      referenceImage: uploadedUrl, // Use the new URL
    };
  };

  const handleAuthCheck = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  // --- MODIFIED THIS FUNCTION ---
  // Now uploads image *before* adding to cart
  const handleAddToCart = async () => {
    if (!handleAuthCheck()) return;

    // 1. Upload image first
    const uploadedUrl = await handleImageUpload();
    if (uploadedUrl === 'error') return; // Stop if upload failed

    // 2. Add to cart with the new URL
    try {
      const itemDetails = getCustomizationDetails(uploadedUrl);
      await addItemToCart(itemDetails);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add item.');
    }
  };

  // --- MODIFIED THIS FUNCTION ---
  // Now uploads image *before* going to checkout
  const handleOrderNow = async () => {
    if (!handleAuthCheck()) return;

    // 1. Upload image first
    const uploadedUrl = await handleImageUpload();
    if (uploadedUrl === 'error') return; // Stop if upload failed
    
    // 2. Go to checkout with the new URL
    const itemDetails = getCustomizationDetails(uploadedUrl);
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
          <label>Print Design Description:</label>
          <textarea 
            rows="3"
            value={printDesign}
            onChange={(e) => setPrintDesign(e.target.value)}
            placeholder="Describe your print idea..."
          ></textarea>
        </div>
        
        {/* --- THIS IS THE NEW FILE UPLOAD INPUT --- */}
        <div className="form-group">
          <label>Reference Image (Optional):</label>
          <input 
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        {/* ------------------------------------------ */}

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

        {/* Buttons are disabled while uploading */}
        <button onClick={handleAddToCart} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Add to Cart'}
        </button>
        <button onClick={handleOrderNow} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Order Now'}
        </button>
      </div>
    </div>
  );
};

export default CustomizationPage;
