const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth.routes.js");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes.js");
const productRouter = require("./routes/product.routes.js");
const cors = require("cors");

// ADD THESE 3 LINES
const cartRouter = require("./routes/cart.routes.js");
const orderRouter = require("./routes/order.routes.js");
const enquiryRouter = require("./routes/enquiry.routes.js");

dotenv.config();
connectDB(process.env.dbURL);

const app = express();

app.use('/images', express.static('public/images'));

const corsOptions = {
  origin: 'http://localhost:5174', // Your client's URL
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/products', productRouter);

// ADD THESE 3 LINES
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/enquiry', enquiryRouter);


app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});