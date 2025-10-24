import api from './index';

// This one exists and is probably fine
export const getProducts = async () => {
  const { data } = await api.get('/products');
  return data;
};

// --- THIS IS THE FUNCTION WITH THE ERROR ---
// It needs to use backticks (`) not single quotes (')
export const getProductById = async (id) => {
  
  // The error is on this line (products.js:11 in your log)
  // It MUST be backticks ``
  const { data } = await api.get(`/products/${id}`);
  
  return data;
};
