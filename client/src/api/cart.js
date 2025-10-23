import api from './index';

export const getCart = async () => {
  const { data } = await api.get('/cart');
  return data;
};

export const addItemToCart = async (itemDetails) => {
  const { data } = await api.post('/cart/add', itemDetails);
  return data;
};

export const updateCartItem = async (itemId, quantity) => {
  const { data } = await api.put(`/cart/update/${itemId}`, { quantity });
  return data;
};

export const removeCartItem = async (itemId) => {
  await api.delete(`/cart/remove/${itemId}`);
};