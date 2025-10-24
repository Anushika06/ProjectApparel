const cloudinary = require('../config/cloudinary.js');

const getUploadSignature = (req, res) => {
  try {
    // Get the current timestamp in seconds
    const timestamp = Math.round((new Date()).getTime() / 1000);

    // Get the signature from Cloudinary
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
