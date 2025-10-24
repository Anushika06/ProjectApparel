import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/common/LoadingSpinner";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    deliveryAddress: "",
    phoneNumber: "",
    deliveryOption: "Standard",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { items } = location.state || { items: [] };

  useEffect(() => {
    if (!items || items.length === 0) {
      toast.error("You must select an item to order.");
      navigate("/");
    }
  }, [items, navigate]);

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
    if (!phone) {
      setPhoneError("Phone number is required.");
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setPhoneError("Please enter a valid phone number (10-15 digits).");
      return false;
    }
    setPhoneError("");
    return true;
  };

  if (!items || items.length === 0) {
    return <LoadingSpinner />;
  }

  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "phoneNumber") {
      validatePhone(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(formData.phoneNumber)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);

    const orderData = {
      items,
      totalAmount,
      deliveryAddress: formData.deliveryAddress,
      phoneNumber: formData.phoneNumber,
      deliveryOption: formData.deliveryOption,
    };

    try {
      const response = await createOrder(orderData);

      toast.success("Order placed! Redirecting to WhatsApp...");

      const { whatsappUrl } = response;

      if (whatsappUrl) {
        window.location.href = whatsappUrl;
      } else {
        console.error("No WhatsApp URL received, redirecting to orders.");
        navigate("/orders");
      }
    } catch (error) {
      toast.error("Failed to place order.");
    } finally {
      setIsLoading(false);
    }
  };
  // --- END OF UPDATE ---

  return (
    <div className="form-container">
      <h1>Checkout</h1>
      <div className="order-summary-checkout" style={{ marginBottom: "20px" }}>
        <h3>Order Summary</h3>
        {items.map((item, index) => {
          const productName = item.productId?.name || "Custom Product";
          const imageUrl =
            item.productId?.imageUrls?.[0] || item.referenceImage;

          return (
            <div
              key={item.productId || index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={productName}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    marginRight: "15px",
                    borderRadius: "4px",
                  }}
                />
              )}
              <div>
                {item.quantity} x {productName}
                <br />
                (₹{item.price.toFixed(2)} each)
              </div>
            </div>
          );
        })}
        <h4 style={{ textAlign: "right", marginTop: "10px" }}>
          Total: ₹{totalAmount.toFixed(2)}
        </h4>
        <h5 style={{ textAlign: "right", marginTop: "10px" }}>
          These charges are exclusive of the delivery charges
        </h5>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Delivery Option</label>
          <select
            name="deliveryOption"
            value={formData.deliveryOption}
            onChange={handleChange}
          >
            <option value="Standard">Standard (5-7 days)</option>
            <option value="Express">Express (1-2 days)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Delivery Address</label>
          <input
            type="text"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          {phoneError && (
            <p
              style={{ color: "red", fontSize: "0.9rem", margin: "5px 0 0 0" }}
            >
              {phoneError}
            </p>
          )}
        </div>
        <button type="submit" disabled={isLoading || !!phoneError}>
          {isLoading ? "Placing Order..." : "Place Order & Send to WhatsApp"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
