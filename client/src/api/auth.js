import api from './index';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/signIn', { email, password });
  return data;
};

export const signup = async (name, email, password) => {
  const { data } = await api.post('/auth/signup', { name, email, password });
  return data;
};

export const logout = async () => {
  await api.post('/auth/signout');
};

export const getCurrentUser = async () => {
  const { data } = await api.get('/user/current');
  return data;
};