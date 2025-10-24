import { useState, useEffect } from 'react';
import { getMyOrders } from '../api/orders';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const PastOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        toast.error('Failed to load past orders.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (orders.length === 0) return <h2 style={{textAlign: 'center'}}>You have no past orders.</h2>;

  return (
    <div className="past-orders-page">
      <h1>Past Orders</h1>
      {orders.map(order => (
        <div key={order._id} className="order-card">
          <h3>Order ID: {order._id}</h3>
          <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>Delivery Address: {order.deliveryAddress}</p>
          {/* --- REMOVED THE "Status: Processing" LINE --- */}
          <p style={{fontWeight: 'bold', fontSize: '1.1rem'}}>Total: ${order.totalAmount.toFixed(2)}</p>
          <h4 style={{marginTop: '15px', marginBottom: '10px'}}>Items:</h4>
          <ul>
            {order.items.map(item => (
              <li key={item._id} style={{marginBottom: '5px'}}>
                {/* item.productId is populated by the backend */}
                {item.quantity} x {item.productId.name} 
                (Size: {item.selectedSize}, Color: {item.selectedColor})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PastOrdersPage;
