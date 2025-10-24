import { useState, useEffect } from "react";
import { getCart, updateCartItem, removeCartItem } from "../api/cart";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await getCart();
      setCart(data);
    } catch (error) {
      toast.error("Failed to load cart.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
      toast.success("Cart updated");
      fetchCart();
    } catch (error) {
      toast.error("Failed to update cart.");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);
      toast.success("Item removed");
      fetchCart();
    } catch (error) {
      toast.error("Failed to remove item.");
    }
  };

  const handleCheckout = () => {
    const validItems = cart.items.filter((item) => item.productId);
    if (validItems.length === 0) {
      toast.error(
        "Your cart contains only deleted products. Please remove them to proceed."
      );
      return;
    }
    navigate("/checkout", { state: { items: validItems } });
  };

  if (isLoading) return <LoadingSpinner />;
  if (!cart || cart.items.length === 0)
    return <h2 style={{ textAlign: "center" }}>Your cart is empty.</h2>;

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cart.items.map((item) => {
        const product = item.productId;
        const productName = product ? product.name : "Deleted Product";
        const imageUrl = product
          ? product.imageUrls[0]
          : "https://placehold.co/80x80/eeeeee/999999?text=N/A";

        return (
          <div key={item._id} className="cart-item">
            <img
              src={imageUrl}
              alt={productName}
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
            <div>
              <h4>{productName}</h4>

              {product ? (
                <p>
                  Size: {item.selectedSize}, Color: {item.selectedColor}
                </p>
              ) : (
                <p style={{ color: "red" }}>
                  This product is no longer available.
                </p>
              )}
              <p>Price: ₹{item.price.toFixed(2)}</p>
            </div>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleUpdateQuantity(item._id, e.target.value)}
              min="1"
              style={{ marginLeft: "auto" }}
              disabled={!product}
            />
            <button onClick={() => handleRemove(item._id)}>Remove</button>
          </div>
        );
      })}
      <div className="order-summary">
        <h3>Total: ₹{cart.totalAmount.toFixed(2)}</h3>
        <button onClick={handleCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;
