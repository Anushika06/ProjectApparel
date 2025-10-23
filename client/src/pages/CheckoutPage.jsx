import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  // Get items from state (either from "Order Now" or "Cart")
  const { items } = location.state || { items: [] };

  // If no items, redirect to cart
  useEffect(() => {
    if (!items || items.length === 0) {
      toast.error('Your cart is empty.');
      navigate('/cart');
    }
  }, [items, navigate]);

  // Calculate total
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // This object matches the `order.js` model
    const orderData = {
      items,
      totalAmount,
      deliveryAddress: formData.deliveryAddress,
      phoneNumber: formData.phoneNumber,
    };

    try {
      await createOrder(orderData);
      toast.success('Order placed successfully!');
      navigate('/orders'); // Redirect to past orders page
    } catch (error) {
      toast.error('Failed to place order.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Checkout</h1>
      <div className="order-summary-checkout" style={{marginBottom: '20px'}}>
        <h3>Order Summary</h3>
        {items.map(item => (
          <p key={item.productId || item.productId._id}>
            {item.quantity} x {item.productId?.name || 'Product'} 
            (${item.price.toFixed(2)} each)
          </p>
        ))}
        <h4 style={{textAlign: 'right', marginTop: '10px'}}>Total: ${totalAmount.toFixed(2)}</h4>
      </div>
      
      <form onSubmit={handleSubmit}>
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
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;