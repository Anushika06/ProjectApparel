import api from './index';

export const getMyOrders = async () => {
  const { data } = await api.get('/orders/my');
  return data; // <-- This return is important for your PastOrdersPage
};

export const createOrder = async (orderData) => {
  // This function calls your server, which responds with { savedOrder, whatsappUrl }
  const { data } = await api.post('/orders/create', orderData);
  
  // --- THIS IS THE FIX ---
  // You must return the 'data' from the axios call
  // so that CheckoutPage.jsx can receive it.
  return data; 
  // -----------------------
};
