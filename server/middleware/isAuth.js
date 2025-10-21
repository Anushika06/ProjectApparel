const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    
    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = isAuth;
