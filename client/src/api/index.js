import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Your backend URL
  withCredentials: true, // This is crucial for httpOnly cookies!
});

export default api;