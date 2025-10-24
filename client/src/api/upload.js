import api from './index';

// 1. Gets the signed signature from *your* backend
export const getSignature = async () => {
  // This calls GET /api/upload/sign
  // isAuth middleware will run, and the cookie will be sent
  const { data } = await api.get('/upload/sign');
  return data;
};

// 2. Uploads the file directly to Cloudinary
export const uploadImage = async (file, signature, timestamp) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  // Get the public API key from your client .env file
  formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY); 

  // Get the cloud name from your client .env file
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  // We use fetch here, not axios, as it's simpler for FormData
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Cloudinary upload failed');
  }
  
  return await response.json();
};
