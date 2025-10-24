import api from './index';


export const getSignature = async () => {

  const { data } = await api.get('/upload/sign');
  return data;
};


export const uploadImage = async (file, signature, timestamp) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY); 


  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;


  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Cloudinary upload failed');
  }
  
  return await response.json();
};
