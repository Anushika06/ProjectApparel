import api from './index';

export const getMyOrders = async () => {
  const { data } = await api.get('/orders/my');
  return data;
};

export const createOrder = async (orderData) => {
  const { data } = await api.post('/orders/create', orderData);
  return data; 
};
