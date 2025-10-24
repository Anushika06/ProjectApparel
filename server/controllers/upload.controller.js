const cloudinary = require('../config/cloudinary.js');

const getUploadSignature = (req, res) => {
  try {
  
    const timestamp = Math.round((new Date()).getTime() / 1000);

    
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({ signature, timestamp });
  } catch (error) {
    res.status(500).json({ message: 'Server error while getting signature.', error: error.message });
  }
};

module.exports = { getUploadSignature };
