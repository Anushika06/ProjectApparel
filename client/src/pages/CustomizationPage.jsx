import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById } from "../api/products";
import { addItemToCart } from "../api/cart";
import { getSignature, uploadImage } from "../api/upload";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/auth/AuthModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const CustomizationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedFabric, setSelectedFabric] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [printDesign, setPrintDesign] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [customColor, setCustomColor] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        if (data.availableSizes.length > 0)
          setSelectedSize(data.availableSizes[0]);

        if (data.availableColors.length > 0)
          setSelectedColor(data.availableColors[0]);
        if (data.fabrics.length > 0) setSelectedFabric(data.fabrics[0]);
      } catch (error) {
        console.error("Failed to fetch product", error);
        toast.error("Product not found.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleImageUpload = async () => {
    if (!imageFile) {
      return "";
    }

    setIsUploading(true);
    toast.loading("Uploading image...");

    try {
      const { signature, timestamp } = await getSignature();
      const uploadData = await uploadImage(imageFile, signature, timestamp);

      toast.dismiss();
      toast.success("Image uploaded!");
      setIsUploading(false);
      return uploadData.secure_url;
    } catch (error) {
      toast.dismiss();
      toast.error("Image upload failed.");
      setIsUploading(false);
      return "error";
    }
  };

  const getCustomizationDetails = (uploadedUrl) => {
    const finalColor = selectedColor === "other" ? customColor : selectedColor;

    return {
      productId: product._id,
      selectedSize,
      selectedColor: finalColor,
      selectedFabric,
      quantity: Number(quantity),
      price: product.basePrice,
      printDesign,
      referenceImage: uploadedUrl,
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

    if (selectedColor === "other" && !customColor) {
      toast.error("Please specify your custom color.");
      return;
    }

    const uploadedUrl = await handleImageUpload();
    if (uploadedUrl === "error") return;

    try {
      const itemDetails = getCustomizationDetails(uploadedUrl);
      await addItemToCart(itemDetails);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add item.");
    }
  };

  const handleOrderNow = async () => {
    if (!handleAuthCheck()) return;

    if (selectedColor === "other" && !customColor) {
      toast.error("Please specify your custom color.");
      return;
    }

    const uploadedUrl = await handleImageUpload();
    if (uploadedUrl === "error") return;

    const itemDetails = getCustomizationDetails(uploadedUrl);
    navigate("/checkout", { state: { items: [itemDetails] } });
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
        <h1 style={{color:"#007bff"}}>{product.name}</h1> 
        <p>{product.description}</p>
        <h3>₹{product.basePrice.toFixed(2)}</h3>

        <div className="form-group">
          <label>Size:</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {product.availableSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Color:</label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            {product.availableColors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}

            <option value="other">Other (Please specify)</option>
          </select>

          {selectedColor === "other" && (
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="Type your custom color"
              style={{
                marginTop: "10px",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          )}
        </div>

        <div className="form-group">
          <label>Fabric:</label>
          <select
            value={selectedFabric}
            onChange={(e) => setSelectedFabric(e.target.value)}
          >
            {product.fabrics.map((fabric) => (
              <option key={fabric} value={fabric}>
                {fabric}
              </option>
            ))}
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

        <div className="form-group">
          <label>Reference Image (Optional):</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
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

        <button onClick={handleAddToCart} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Add to Cart"}
        </button>
        <button onClick={handleOrderNow} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Order Now"}
        </button>
      </div>
    </div>
  );
};

export default CustomizationPage;
