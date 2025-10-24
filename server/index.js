const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth.routes.js");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes.js");
const productRouter = require("./routes/product.routes.js");
const cors = require("cors");

// Import all your routes
const cartRouter = require("./routes/cart.routes.js");
const orderRouter = require("./routes/order.routes.js");
const enquiryRouter = require("./routes/enquiry.routes.js");
const uploadRouter = require("./routes/upload.routes.js");

dotenv.config();
connectDB(process.env.dbURL);

const app = express();

app.use('/images', express.static('public/images'));

const allowedOrigins = [
  'http://localhost:5173', 
  'https://project-apparel.vercel.app',
  'https://project-apparel-3i2y61a24-anushikas-projects-e657cf47.vercel.app' 
];



const corsOptions = {
  origin: function (origin, callback) {
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/enquiry', enquiryRouter);
app.use('/api/upload', uploadRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});

