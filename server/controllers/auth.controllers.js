const genToken = require("../config/token.js");
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const PasswordValidator = require("password-validator");

const passwordSchema = new PasswordValidator();
passwordSchema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)
  .has().symbols(1)
  .is().not().spaces()
  .is().not().oneOf(['Password', 'Password123', 'password']);


const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const failures = passwordSchema.validate(password, { list: true });

    if (failures.length > 0) {
      let errorMessage;
      switch (failures[0]) {
        case 'min': errorMessage = 'Password must be at least 8 characters long.'; break;
        case 'uppercase': errorMessage = 'Password must have at least one uppercase letter.'; break;
        case 'lowercase': errorMessage = 'Password must have at least one lowercase letter.'; break;
        case 'digits': errorMessage = 'Password must have at least one digit.'; break;
        case 'symbols': errorMessage = 'Password must have at least one symbol.'; break;
        default: errorMessage = 'Password is too weak.';
      }
      return res.status(400).json({ message: errorMessage });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = await genToken(newUser._id); 

    
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none", 
      secure: true, 
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });
    

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await genToken(user._id); 

    
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none", 
      secure: true, 
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });
    

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const signOut = (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "none", 
      secure: true, 
      expires: new Date(0), 
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { signUp, signIn, signOut };
