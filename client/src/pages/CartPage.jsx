import { useState, useEffect } from 'react';
import { getCart, updateCartItem, removeCartItem } from '../api/cart';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

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
      toast.error('Failed to load cart.');
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
      toast.success('Cart updated');
      fetchCart(); // Refetch cart
    } catch (error) {
      toast.error('Failed to update cart.');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);
      toast.success('Item removed');
      fetchCart(); // Refetch cart
    } catch (error) {
      toast.error('Failed to remove item.');
    }
  };
  
  const handleCheckout = () => {
    // Pass the cart items to the checkout page
    navigate('/checkout', { state: { items: cart.items } });
  };

  if (isLoading) return <LoadingSpinner />;
  if (!cart || cart.items.length === 0) return <h2 style={{textAlign: 'center'}}>Your cart is empty.</h2>;

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cart.items.map(item => (
        <div key={item._id} className="cart-item">
          {/* item.productId is populated by the backend */}
          <img src={item.productId.imageUrls[0]} alt={item.productId.name} style={{width: '80px', height: '80px', objectFit: 'cover'}} />
          <div>
            <h4>{item.productId.name}</h4>
            <p>Size: {item.selectedSize}, Color: {item.selectedColor}</p>
            <p>Price: ${item.price.toFixed(2)}</p>
          </div>
          <input 
            type="number" 
            value={item.quantity}
            onChange={(e) => handleUpdateQuantity(item._id, e.target.value)}
            min="1"
            style={{marginLeft: 'auto'}}
          />
          <button onClick={() => handleRemove(item._id)}>Remove</button>
        </div>
      ))}
      <div className="order-summary">
        <h3>Total: ${cart.totalAmount.toFixed(2)}</h3>
        <button onClick={handleCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;