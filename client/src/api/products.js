import api from './index';

// This one exists
export const getProducts = async () => {
  const { data } = await api.get('/products');
  return data;
};

// This one you just created
export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};