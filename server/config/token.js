const jwt = require("jsonwebtoken");

// Your genToken was async, but jwt.sign is synchronous.
// This is the correct, simpler version from your text block.
const genToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = genToken;
